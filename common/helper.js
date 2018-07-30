const mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * 
 * @param {String} str
 * Removes unwanted spaces and line-breaks 
 */
function sanitiseString(str) {
    let sanitisedStr = '';
    let blank = 0;
    for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) === 8203) continue;
        if (str.charAt(i) === ' ' || str.charAt(i) === '\n') {
            if (!sanitisedStr)
                continue;
            if (blank)
                continue;
            blank++;
            sanitisedStr += str.charAt(i);
            continue;
        }
        blank = 0;
        sanitisedStr += str.charAt(i);
    }
    if (sanitisedStr.charAt(sanitisedStr.length - 1) === ' ' || sanitisedStr.charAt(sanitisedStr.length - 1) === '\n')
        sanitisedStr = sanitisedStr.slice(0, sanitisedStr.length - 1);
    return sanitisedStr;
}

/**
 * 
 * @param {String} string 
 * @param {Object} totalSchema
 * Create fields of Schema 
 */
function createSchemaField(string, totalSchema) {
    const validateObj = {
        type: '',
        unique: false,
        required: false
    };
    string = sanitiseString(string);
    const sp = string.split(':');
    const field = {};
    field.name = sp[0];
    if (sp[1].indexOf('[') !== -1) {
        field.value = [totalSchema[sp[1].slice(sp[1].indexOf('[') + 1, sp[1].indexOf(']'))]];
    }
    else {
        if (sp[1].indexOf('String') !== -1)
            validateObj.type = String;
        if (sp[1].indexOf('Int') !== -1)
            validateObj.type = Number;
        if (sp[1].indexOf('Date') !== -1)
            validateObj.type = Date;
        if (sp[1].indexOf('Boolean') !== -1)
            validateObj.type = Boolean;
        if (sp[1].indexOf('Buffer') !== -1)
            validateObj.type = Buffer;
        if (sp[1].indexOf('ObjectId') !== -1)
            validateObj.type = Schema.Types.ObjectId;
        if (sp[1].indexOf('Mixed') !== -1)
            validateObj.type = Schema.Types.Mixed;
        if (sp[1].indexOf('Decimal128') !== -1)
            validateObj.type = Schema.Types.Decimal128;

        if (sp[1].indexOf('@unique') !== -1)
            validateObj.unique = true;
        if (sp[1].indexOf('!') !== -1)
            validateObj.required = true;
        field.value = validateObj;
    }
    return field;
}


/**
 * 
 * @param {String} string 
 * @param {Object} totalSchema 
 */
function createSchemaObject(string, totalSchema) {
    return string.split(',').reduce((accumulator, current, arrObj) => {
        const field = createSchemaField(current, totalSchema);
        accumulator[field.name] = field.value
        return accumulator;
    }, {});
}


/**
 * 
 * @param {String} string 
 * @param {Object} totalSchema 
 * Create schema from given type string
 */
function createSchema(string, totalSchema) {
    const schemaObj = {
        model: false
    };
    const newstring = sanitiseString(string);
    if (newstring.indexOf('type') === -1) {
        console.log('This is not a Type string');
        process.exit(-1);
    }
    let typeName = '';
    for (let i = 5; ; i++) {
        if (newstring.charCodeAt(i) === 32) break;
        if (newstring.charCodeAt(i) === 10) break;
        if (newstring.charCodeAt(i) === 123) break;
        typeName += newstring.charAt(i);
    }
    if (newstring.indexOf('@model') !== -1)
        schemaObj.model = true;
    schemaObj[typeName] = new Schema(createSchemaObject(string.slice(string.indexOf('{') + 1, string.length - 1), totalSchema));
    return schemaObj;
}

/**
 * 
 * @param {Variadic string argument} strings 
 * Create models from given type strings
 */
function createModels(...strings) {
    const totalSchema = {};
    return strings.reduce((acc, str) => {
        const s = createSchema(str, totalSchema);
        totalSchema[Object.keys(s)[1]] = s[Object.keys(s)[1]];
        if (s.model) {
            acc = {
                [Object.keys(s)[1]]: s[Object.keys(s)[1]]
            }
            return acc;
        }
    }, {});
}

module.exports = { createModels, sanitiseString };
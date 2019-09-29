var passwordValidator = require('password-validator');

// Create a schema
export var PASSWORD_SCHEMA = new passwordValidator();

const min_len = 6
const max_len = 100

// NOTE: for every rule added to the Schema, a corresponding parsing conditional should be added below
PASSWORD_SCHEMA
    .is().min(min_len)                                    // Minimum length 8
    .is().max(max_len)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().digits()                                 // Must have digits
    .is().not().oneOf(['password', 'Password123']); // Blacklist these values
    // .has().lowercase()                              // Must have lowercase letters
    // .has().not().spaces()                           // Should not have spaces

export const parseFailedRules = (rules) => {
    var output = ''
    for (var i=0; i < rules.length; i++){
        if (i >=1) output += " | "
        
        var rule = rules[i]
        if (rule === 'min'){
            output += `Password must be at least ${min_len} characters long`
        }
        if (rule === 'max') {
            output += `Password must be at most ${max_len} characters long`
        }
        if (rule === 'uppercase') {
            output += `Password must have an uppercase letter`
        }
        if (rule === 'digits') {
            output += `Password must have a digit`
        }
        if (rule === 'oneOf') {
            output += `Password is too common`
        }
    }
    return output
}
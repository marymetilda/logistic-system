const success = (data, message = "Success") => ({ success: true, message, data });
const error = (message, statusCode = 400) => ({ success: false, message, statusCode });

module.exports = { success, error };

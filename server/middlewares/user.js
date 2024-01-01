
const firstMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        statusCode,
        success: false,
        message,
    });
}

export default firstMiddleware;
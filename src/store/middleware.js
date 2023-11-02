const middleware = (store) => (next) => (action) => {
    if (typeof action.payload?.callback === 'function') {
        action.payload.callback();
    }
    next(action);
};

export default middleware;
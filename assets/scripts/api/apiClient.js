var apiClientHelper = function (baseURL) { 
    var client = (function httpClient() {
        return {
            get: (path, options) => {
                return fetch(baseURL + path, options).then(res => {
                    if (!res.ok) {
                        throw new Error(res.statusText);
                    }

                    return res.json();
                });
            }, 
            post: (path, body, options = {}) => {
                return fetch(baseURL + path, {
                    ...options,
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {
                        'Content-Type': 'application/json',
                        ...options.headers
                    }
                }).then(res => {
                    if (!res.ok) {
                        throw new Error(res.statusText);
                    }

                    return res.json();
                });
            }
        };
    }
    )();

    function get(args) {
        var queryString = !args ? "s=Batman" : Object.keys(args).map(key => args[key] ? key + '=' + args[key] + '&' : '').join('');
        return client.get(queryString);
    }

    function post(id) {
        return client.get("i=" + id);
    }
    return {
        post,
        get
    }
};
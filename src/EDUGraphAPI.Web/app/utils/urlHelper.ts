export class UrlHelper {
    
    public static getHashValue(key): string {
        var matches = window.location.hash.match(new RegExp(key + '=([^&]*)'));
        var value = matches ? matches[1] : null;
        if (value == null) return null;
        return decodeURIComponent(decodeURI(value)).replace(/\+/g, ' ')
    }

    public static getQueryValue(key): string {
        var matches = window.location.hash.match(new RegExp(key + '=([^&]*)'));
        var value = matches ? matches[1] : null;
        if (value == null) return null;
        return decodeURIComponent(decodeURI(value)).replace(/\+/g, ' ')
    }
    public static getUrlQueryValue(key): string {
        var matches = window.location.href.match(new RegExp(key + '=([^&]*)'));
        var value = matches ? matches[1] : null;
        if (value == null) return null;
        return decodeURIComponent(decodeURI(value)).replace(/\+/g, ' ')
    }
}
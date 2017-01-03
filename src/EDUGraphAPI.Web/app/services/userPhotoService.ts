/// <reference path="../../node_modules/@types/jquery/index.d.ts" />

import { Injectable, Inject } from '@angular/core';
import { SvcConsts } from '../SvcConsts/SvcConsts';
import { ConvertHelper } from '../utils/convertHelper';

@Injectable()
export class UserPhotoService {
    constructor( @Inject('auth') private authService) {
    }

    public getUserPhotoUrl(userId: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.authService.getMSAccessToken()
                .subscribe((result) => {
                    var url = `${SvcConsts.MS_GRAPH_RESOURCE}/v1.0/${SvcConsts.TENANT_ID}/users/${userId}/photo/$value`;
                    return $.ajax({
                        url: url,
                        type: 'GET',
                        headers: { 'Authorization': 'Bearer ' + result.accesstoken },
                        mimeType: "text/plain; charset=x-user-defined",
                        success: function (data) {
                            var dataUrl = `data:image/jpeg;base64,${ConvertHelper.BinaryToBase64(data)}`;
                            resolve(dataUrl);
                        },
                        error: reject
                    });
                });
        });
    }
}

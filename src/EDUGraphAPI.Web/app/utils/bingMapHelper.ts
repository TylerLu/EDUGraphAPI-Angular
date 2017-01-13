﻿/// <reference path="../../node_modules/@types/jquery/index.d.ts" />

import { Injectable, Inject } from '@angular/core';
import { Constants } from '../Constants';

export class BingMapHelper {

    /**
     * Retrieves longitude and latitude by address.
     * Reference URL: 
     */
    public static getLatitudeAndLongitude(state: string, city: string, address: string): Promise<any> {
        return new Promise((resolve, reject) => {
            var url = `//dev.virtualearth.net/REST/v1/Locations/US/${state}/${city}/${address}?output=json&key=${Constants.BING_MAP_KEY}`;
            return $.ajax({
                url: url,
                dataType: "jsonp",
                jsonp: "jsonp",
                success: function (data) {
                    if (data && (data["resourceSets"] instanceof Array) && data["resourceSets"].length > 0) {
                        var resourceSet = data["resourceSets"][0];
                        if (resourceSet && (resourceSet["resources"] instanceof Array) && resourceSet["resources"].length > 0) {
                            var resource = resourceSet["resources"][0];
                            if (resource["point"] && resource["point"]["coordinates"]) {
                                var coordinates = resource["point"]["coordinates"];
                                resolve({ Latitude: coordinates[0], Longitude: coordinates[1] });
                            }
                        }
                        reject();
                    }
                },
                error: reject
            });
        });
    }
}
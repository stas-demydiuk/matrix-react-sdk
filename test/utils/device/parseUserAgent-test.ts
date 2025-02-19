/*
Copyright 2022 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { DeviceType, ExtendedDeviceInformation, parseUserAgent } from "../../../src/utils/device/parseUserAgent";

const makeDeviceExtendedInfo = (
    deviceType: DeviceType,
    deviceModel?: string,
    deviceOperatingSystem?: string,
    clientName?: string,
    clientVersion?: string,
): ExtendedDeviceInformation => ({
    deviceType,
    deviceModel,
    deviceOperatingSystem,
    client: clientName && [clientName, clientVersion].filter(Boolean).join(' '),
});

/* eslint-disable max-len */
const ANDROID_UA = [
    // New User Agent Implementation
    "Element dbg/1.5.0-dev (Xiaomi Mi 9T; Android 11; RKQ1.200826.002 test-keys; Flavour GooglePlay; MatrixAndroidSdk2 1.5.2)",
    "Element/1.5.0 (Samsung SM-G960F; Android 6.0.1; RKQ1.200826.002; Flavour FDroid; MatrixAndroidSdk2 1.5.2)",
    "Element/1.5.0 (Google Nexus 5; Android 7.0; RKQ1.200826.002 test test; Flavour FDroid; MatrixAndroidSdk2 1.5.2)",
    "Element/1.5.0 (Google (Nexus) 5; Android 7.0; RKQ1.200826.002 test test; Flavour FDroid; MatrixAndroidSdk2 1.5.2)",
    "Element/1.5.0 (Google (Nexus) (5); Android 7.0; RKQ1.200826.002 test test; Flavour FDroid; MatrixAndroidSdk2 1.5.2)",
    // Legacy User Agent Implementation
    "Element/1.0.0 (Linux; U; Android 6.0.1; SM-A510F Build/MMB29; Flavour GPlay; MatrixAndroidSdk2 1.0)",
    "Element/1.0.0 (Linux; Android 7.0; SM-G610M Build/NRD90M; Flavour GPlay; MatrixAndroidSdk2 1.0)",
];

const ANDROID_EXPECTED_RESULT = [
    makeDeviceExtendedInfo(DeviceType.Mobile, "Xiaomi Mi 9T", "Android 11"),
    makeDeviceExtendedInfo(DeviceType.Mobile, "Samsung SM-G960F", "Android 6.0.1"),
    makeDeviceExtendedInfo(DeviceType.Mobile, "LG Nexus 5", "Android 7.0"),
    makeDeviceExtendedInfo(DeviceType.Mobile, "Google (Nexus) 5", "Android 7.0"),
    makeDeviceExtendedInfo(DeviceType.Mobile, "Google (Nexus) (5)", "Android 7.0"),
    makeDeviceExtendedInfo(DeviceType.Mobile, "Samsung SM-A510F", "Android 6.0.1"),
    makeDeviceExtendedInfo(DeviceType.Mobile, "Samsung SM-G610M", "Android 7.0"),
];

const IOS_UA = [
    "Element/1.8.21 (iPhone; iOS 15.2; Scale/3.00)",
    "Element/1.8.21 (iPhone XS Max; iOS 15.2; Scale/3.00)",
    "Element/1.8.21 (iPad Pro (11-inch); iOS 15.2; Scale/3.00)",
    "Element/1.8.21 (iPad Pro (12.9-inch) (3rd generation); iOS 15.2; Scale/3.00)",
];
const IOS_EXPECTED_RESULT = [
    makeDeviceExtendedInfo(DeviceType.Mobile, "Apple iPhone", "iOS 15.2"),
    makeDeviceExtendedInfo(DeviceType.Mobile, "Apple iPhone XS Max", "iOS 15.2"),
    makeDeviceExtendedInfo(DeviceType.Mobile, "iPad Pro (11-inch)", "iOS 15.2"),
    makeDeviceExtendedInfo(DeviceType.Mobile, "iPad Pro (12.9-inch) (3rd generation)", "iOS 15.2"),
];
const DESKTOP_UA = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) ElementNightly/2022091301 Chrome/104.0.5112.102" +
            " Electron/20.1.1 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) ElementNightly/2022091301 Chrome/104.0.5112.102 Electron/20.1.1 Safari/537.36",
];
const DESKTOP_EXPECTED_RESULT = [
    makeDeviceExtendedInfo(DeviceType.Desktop, undefined, "Mac OS 10.15.7", "Electron", "20"),
    makeDeviceExtendedInfo(DeviceType.Desktop, undefined, "Windows 10", "Electron", "20"),
];

const WEB_UA = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:39.0) Gecko/20100101 Firefox/39.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/600.3.18 (KHTML, like Gecko) Version/8.0.3 Safari/600.3.18",
    "Mozilla/5.0 (Windows NT 6.0; rv:40.0) Gecko/20100101 Firefox/40.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246",
    // using mobile browser
    "Mozilla/5.0 (iPad; CPU OS 8_4_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12H321 Safari/600.1.4",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 8_4_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12H321 Safari/600.1.4",
    "Mozilla/5.0 (Linux; Android 9; SM-G973U Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Mobile Safari/537.36",
];

const WEB_EXPECTED_RESULT = [
    makeDeviceExtendedInfo(DeviceType.Web, undefined, "Mac OS 10.15.7", "Chrome", "104"),
    makeDeviceExtendedInfo(DeviceType.Web, undefined, "Windows 10", "Chrome", "104"),
    makeDeviceExtendedInfo(DeviceType.Web, undefined, "Mac OS 10.10", "Firefox", "39"),
    makeDeviceExtendedInfo(DeviceType.Web, undefined, "Mac OS 10.10.2", "Safari", "8"),
    makeDeviceExtendedInfo(DeviceType.Web, undefined, "Windows Vista", "Firefox", "40"),
    makeDeviceExtendedInfo(DeviceType.Web, undefined, "Windows 10", "Edge", "12"),
    // using mobile browser
    makeDeviceExtendedInfo(DeviceType.Web, "Apple iPad", "iOS 8.4.1", "Mobile Safari", "8"),
    makeDeviceExtendedInfo(DeviceType.Web, "Apple iPhone", "iOS 8.4.1", "Mobile Safari", "8"),
    makeDeviceExtendedInfo(DeviceType.Web, "Samsung SM-G973U", "Android 9", "Chrome", "69"),

];

const MISC_UA = [
    "AppleTV11,1/11.1",
    "Curl Client/1.0",
    "banana",
    "",
];

const MISC_EXPECTED_RESULT = [
    makeDeviceExtendedInfo(DeviceType.Unknown, "Apple Apple TV", undefined, undefined, undefined),
    makeDeviceExtendedInfo(DeviceType.Unknown, undefined, undefined, undefined, undefined),
    makeDeviceExtendedInfo(DeviceType.Unknown, undefined, undefined, undefined, undefined),
    makeDeviceExtendedInfo(DeviceType.Unknown, undefined, undefined, undefined, undefined),
];
/* eslint-disable max-len */

describe('parseUserAgent()', () => {
    it('returns deviceType unknown when user agent is falsy', () => {
        expect(parseUserAgent(undefined)).toEqual({
            deviceType: DeviceType.Unknown,
        });
    });

    type TestCase = [string, ExtendedDeviceInformation];

    const testPlatform = (platform: string, userAgents: string[], results: ExtendedDeviceInformation[]): void => {
        const testCases: TestCase[] = userAgents.map((userAgent, index) => [userAgent, results[index]]);

        describe(platform, () => {
            it.each(
                testCases,
            )('Parses user agent correctly -  %s', (userAgent, expectedResult) => {
                expect(parseUserAgent(userAgent)).toEqual(expectedResult);
            });
        });
    };

    testPlatform('Android', ANDROID_UA, ANDROID_EXPECTED_RESULT);
    testPlatform('iOS', IOS_UA, IOS_EXPECTED_RESULT);
    testPlatform('Desktop', DESKTOP_UA, DESKTOP_EXPECTED_RESULT);
    testPlatform('Web', WEB_UA, WEB_EXPECTED_RESULT);
    testPlatform('Misc', MISC_UA, MISC_EXPECTED_RESULT);
});

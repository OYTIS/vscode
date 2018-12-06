// MIT License
//
// Copyright 2018 Electric Imp
//
// SPDX-License-Identifier: MIT
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
// EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES
// OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
// ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.


const vscode = require('vscode');
const ImpCentralApi = require('imp-central-api');
const Auth = require('./auth');
const User = require('./user');
const Workspace = require('./workspace');

function getAgentURL(accessToken) {
    vscode.window.showInputBox({ prompt: User.MESSAGES.DEVICE_PROMPT_DEVICE_ID })
        .then((deviceID) => {
            if (!deviceID) {
                vscode.window.showErrorMessage(User.ERRORS.DEVICE_ID_EMPTY);
                return;
            }

            const api = new ImpCentralApi();
            api.auth.accessToken = accessToken;
            api.devices.get(deviceID)
                .then((device) => {
                    vscode.window.showInformationMessage(device.data.attributes.agent_url);
                }, (err) => {
                    vscode.window.showErrorMessage(`${User.ERRORS.DEVICE_RETRIEVE} ${err}`);
                });
        });
}

// Get agent URL related with device.
// The URL will be displayed in the pop-up message.
//
// Parameters:
//     none
//
// Returns:
//     none
function getAgentURLDialog() {
    Auth.authorize()
        .then(getAgentURL, (err) => {
            vscode.window.showErrorMessage(`${User.ERRORS.AUTH_LOGIN} ${err}`);
        });
}
module.exports.getAgentURLDialog = getAgentURLDialog;

function addDeviceToDG(accessToken) {
    const config = Workspace.getWorkspaceData();
    if (config === undefined) {
        return;
    }

    vscode.window.showInputBox({ prompt: User.MESSAGES.DEVICE_PROMPT_DEVICE_ID })
        .then((deviceID) => {
            if (!deviceID) {
                vscode.window.showErrorMessage(User.ERRORS.DEVICE_ID_EMPTY);
                return;
            }

            const api = new ImpCentralApi();
            api.auth.accessToken = accessToken;
            api.deviceGroups.addDevices(config.deviceGroupId, deviceID)
                .then(() => {
                    vscode.window.showInformationMessage(`The ${deviceID} is added to ${config.deviceGroupId}`);
                }, (err) => {
                    vscode.window.showErrorMessage(`Can not add device: ${err}`);
                });
        });
}

// Add device to DG using device ID.
//
// Parameters:
//     none
//
// Returns:
//     none
function addDeviceToDGDialog() {
    Auth.authorize()
        .then(addDeviceToDG, (err) => {
            vscode.window.showErrorMessage(`${User.ERRORS.AUTH_LOGIN} ${err}`);
        });
}
module.exports.addDeviceToDGDialog = addDeviceToDGDialog;

function removeDeviceFromDG(accessToken) {
    const config = Workspace.getWorkspaceData();
    if (config === undefined) {
        return;
    }

    vscode.window.showInputBox({ prompt: User.MESSAGES.DEVICE_PROMPT_DEVICE_ID })
        .then((deviceID) => {
            if (!deviceID) {
                vscode.window.showErrorMessage(User.ERRORS.DEVICE_ID_EMPTY);
                return;
            }

            const api = new ImpCentralApi();
            api.auth.accessToken = accessToken;
            api.deviceGroups.removeDevices(config.deviceGroupId, null, deviceID)
                .then(() => {
                    vscode.window.showInformationMessage(`The ${deviceID} is removed from ${config.deviceGroupId}`);
                }, (err) => {
                    vscode.window.showErrorMessage(`Cannot remove device: ${err}`);
                });
        });
}

// Remove device from DG using device ID.
//
// Parameters:
//     none
//
// Returns:
//     none
function removeDeviceFromDGDialog() {
    Auth.authorize()
        .then(removeDeviceFromDG, (err) => {
            vscode.window.showErrorMessage(`${User.ERRORS.AUTH_LOGIN} ${err}`);
        });
}
module.exports.removeDeviceFromDGDialog = removeDeviceFromDGDialog;

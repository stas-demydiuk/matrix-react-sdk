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

import React from 'react';

import StyledCheckbox, { CheckboxStyle } from '../../elements/StyledCheckbox';
import DeviceTile, { DeviceTileProps } from './DeviceTile';

interface Props extends DeviceTileProps {
    isSelected: boolean;
    onClick: () => void;
}

const SelectableDeviceTile: React.FC<Props> = ({ children, device, isSelected, onClick }) => {
    return <div className='mx_SelectableDeviceTile'>
        <StyledCheckbox
            kind={CheckboxStyle.Solid}
            checked={isSelected}
            onChange={onClick}
            className='mx_SelectableDeviceTile_checkbox'
            id={`device-tile-checkbox-${device.device_id}`}
            data-testid={`device-tile-checkbox-${device.device_id}`}
        />
        <DeviceTile device={device} onClick={onClick} isSelected={isSelected}>
            { children }
        </DeviceTile>
    </div>;
};

export default SelectableDeviceTile;

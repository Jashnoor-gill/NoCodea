import React, { useState } from 'react';

const DeviceManager = ({ onDeviceChange, onClose }) => {
  const [selectedDevice, setSelectedDevice] = useState('desktop');

  const devices = [
    {
      id: 'desktop',
      name: 'Desktop',
      icon: '🖥️',
      width: '100%',
      height: '100%',
      minWidth: 1200,
      maxWidth: null
    },
    {
      id: 'tablet',
      name: 'Tablet',
      icon: '📱',
      width: '768px',
      height: '1024px',
      minWidth: 768,
      maxWidth: 1199
    },
    {
      id: 'tablet-landscape',
      name: 'Tablet Landscape',
      icon: '📱',
      width: '1024px',
      height: '768px',
      minWidth: 768,
      maxWidth: 1199
    },
    {
      id: 'mobile',
      name: 'Mobile',
      icon: '📱',
      width: '375px',
      height: '667px',
      minWidth: 320,
      maxWidth: 767
    },
    {
      id: 'mobile-landscape',
      name: 'Mobile Landscape',
      icon: '📱',
      width: '667px',
      height: '375px',
      minWidth: 320,
      maxWidth: 767
    },
    {
      id: 'custom',
      name: 'Custom',
      icon: '⚙️',
      width: '800px',
      height: '600px',
      minWidth: 200,
      maxWidth: 2000
    }
  ];

  const handleDeviceSelect = (device) => {
    setSelectedDevice(device.id);
    if (onDeviceChange) {
      onDeviceChange(device);
    }
  };

  const getDeviceStyles = (device) => {
    if (device.id === 'desktop') {
      return {
        width: '100%',
        height: '100%',
        maxWidth: 'none',
        minWidth: 'none'
      };
    }
    
    return {
      width: device.width,
      height: device.height,
      maxWidth: device.width,
      minWidth: device.width
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Device Manager</h2>
            <p className="text-sm text-gray-600">Preview your website on different devices</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Device List */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {devices.map((device) => (
              <button
                key={device.id}
                onClick={() => handleDeviceSelect(device)}
                className={`p-4 border-2 rounded-lg transition-all duration-200 text-left ${
                  selectedDevice === device.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{device.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900">{device.name}</div>
                    <div className="text-sm text-gray-500">
                      {device.width} × {device.height}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Device Settings */}
        {selectedDevice === 'custom' && (
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Custom Dimensions</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Width (px)</label>
                <input
                  type="number"
                  min="200"
                  max="2000"
                  defaultValue="800"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => {
                    const customDevice = devices.find(d => d.id === 'custom');
                    customDevice.width = `${e.target.value}px`;
                    handleDeviceSelect(customDevice);
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (px)</label>
                <input
                  type="number"
                  min="200"
                  max="2000"
                  defaultValue="600"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => {
                    const customDevice = devices.find(d => d.id === 'custom');
                    customDevice.height = `${e.target.value}px`;
                    handleDeviceSelect(customDevice);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Current: {devices.find(d => d.id === selectedDevice)?.name}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceManager; 
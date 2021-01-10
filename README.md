<div style="text-align: center;">
    <img style="width: 30%;" src="docs/logo.png" alt="NanoPlay" /><br>
    <img style="width: 70%;" src="docs/demo.png" alt="Demonstration image of the NanoPlay" />
</div>
<h1 style="text-align: center;">NanoPlay OS</h1>
<p style="text-align: center;">NanoPlay OS, the operating system and firmware that runs on the NanoPlay device.</p>

## About NanoPlay OS
NanoPlay OS is a small operating system written entirely in JavaScript which
runs on the NanoPlay device, powered by [Espruino](https://espruino.com).
NanoPlay OS allows users to create their own apps in our IDE and then upload
their apps to their NanoPlay via Bluetooth Low Energy. With a feature-rich yet
easy-to-learn API designed to allow apps to access the versatile features of the
NanoPlay, the NanoPlay can be used as a multifunctional yet portable device.

The NanoPlay API allows apps to:
* Display shapes, text and other graphics on the NanoPlay's LCD
* Get the current state of the NanoPlay's four buttons
* Read and write values to the six analog pins exposed on the back of the
  NanoPlay
* Read and write data files which are stored in non-volatile flash storage, as
  well as list the data files on the NanoPlay
* Set the NFC chip to emit a specified URL to nearby devices
* Get the current fullness percentage of the on-board CR2032 battery
* Get the current environment temperature in degrees Celsius, degrees Fahrenheit
  or Kelvin
* Get the locale code of the chosen language to allow for multilingual
  interactivity
<p align="center">
    <img width="30%" src="docs/logo.png" alt="NanoPlay" /><br>
    <img width="70%" src="docs/demo.png" alt="Demonstration image of the NanoPlay" />
</p>
<h1 align="center">NanoPlay OS</h1>
<p align="center">NanoPlay OS, the operating system and firmware that runs on the NanoPlay device.</p>
<p align="center"><a href="https://nanoplay.subnodal.com">nanoplay.subnodal.com</a></p>

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

## Building
Prerequisites:
* Python 3
* Node.js
* terser (`sudo npm install -g terser`)

To build NanoPlay OS, run the `build.py` file. Once building is complete, upload
the files in `build/` to your NanoPlay using the Espruino Web IDE. Don't forget
to upload the `.bootrst` file (which may be hidden in your file manager) since
this ensures that the OS runs at startup.

## Distributing
After building NanoPlay OS, you can generate a distribution file that can be
used to update existing NanoPlay devices over-the-air. To generate this file,
run the `dist.py` script. Once distributing is complete, you can use the
`npupdate.json` file in the `dist/` directory to apply the update.

`npupdate.json` should not be uploaded to the NanoPlay (it won't even fit, so
good luck getting it on...). The file is intended as an archive that is supplied
to the [NanoPlay Web API](https://github.com/NanoPlay/WebAPI) for updating the
NanoPlay file-by-file.

The beauty of this over-the-air update method as compared to the previous update
method (where one had to manually upload each file through the Espruino Web IDE)
is that updating is fast and all automatic, and apps and other user data will
not be erased when updating.

## Contributing
Contributions to NanoPlay OS are very much welcome! You may want to search for
issues tagged with
**[good first issue](https://github.com/NanoPlay/os/labels/good%20first%20issue)**
since resolving those issues will help you learn how to write code for NanoPlay
OS. If you fork the repo (since you won't be able to make changes to the main
NanoPlay repo), you can then submit a pull request for us to review.

## Writing apps
If you know how to write JavaScript, then you'll find making apps for NanoPlay
easy and intuitive. NanoPlay apps are constructed of two files (which both must
bear the same filename, disregarding the extension). Your main code will reside
in a file with the file extension of `.np`, and the app manifst will reside in
another file with the file extension of `.npm`.

See [the test app](https://github.com/NanoPlay/os/tree/main/testapp) to see an
example of a NanoPlay app.

In the `.np` app, JavaScript code that resides in a function called `start` will
run once when your app is opened. Code that resides in a function called `loop`
will run continuously (for every frame) until your code either makes a call to
the `close` API command, or if execution is interrupted by holding down all four
buttons on the NanoPlay.

We suggest that you define your variables outside of the two functions. All
other code must reside in either of the functions. Defining the functions is
optional, so if you don't need to run any code at start, then you don't have to
define the `start` function.

In terms of the manifest (`.npm`) file, it is formatted as a JSON file. A very
minimal manifest would be:

```json
{
    "name": "App Name"
}
```

In this example, the same app name will be used no matter what locale is chosen.
The app's icon will be the default icon which is shown when the `icon` key of
the JSON file is undefined.

A complete manifest would look like this:

```json
{
    "name": {
        "en_GB": "App Name",
        "fr_FR": "Nom d'app"
    },
    "icon": "AAAAAAAAAA ... AAAAAAAA=="
}
```

Here, the name of the app will be chosen depending on the current locale. If the
current locale doesn't have a matching app name in the manifest, the filename
(without the extension) will be used instead. Also, the icon is a Base64
representation of a 44x17 raw binary matrix.

### Uploading apps to the NanoPlay
As a user, you can write code and upload it to your NanoPlay via the
[NanoPlay IDE](https://nanoplay.subnodal.com/dashboard/editor.html), which is
a web app that is usable from our website. The IDE uploads apps using Web
Bluetooth, so a browser that supports this feature is required. A simulator is
also integrated into the IDE for rapid prototyping, so that you don't have to
upload your app to your NanoPlay to test small changes.

An added bonus with the IDE is that you don't need to write a manifest ─ it is
automatically generated for you based on the app settings.

If you're looking to interface the NanoPlay with your very own web app, you can
use the [NanoPlay Web API](https://github.com/NanoPlay/WebAPI) to control
various aspects of the NanoPlay. It is the same API that's used in the IDE to
send the code to the NanoPlay.
var effects = app.effects;
var generateCat = [];
var styleCat = [];
var distortCat = [];
var colourCat = [];
var blurCat = [];
for(var i = 0; i < effects.length; i++) {
    switch(effects[i]["category"]) {
        case "Generate":
        if(effects[i]["displayName"] != "Audio Spectrum" && effects[i]["displayName"] != "Audio Waveform" && effects[i]["displayName"] != "CC Glue Gun" && effects[i]["displayName"] != "CC Light Burst 2.5" && effects[i]["displayName"] != "CC Light Sweep" && effects[i]["displayName"] != "CC Threads" && effects[i]["displayName"] != "Circle" && effects[i]["displayName"] != "Ellipse" && effects[i]["displayName"] != "Eyedropper Fill" && effects[i]["displayName"] != "Paint Bucket" && effects[i]["displayName"] != "Scribble" && effects[i]["displayName"] != "Stroke" && effects[i]["displayName"] != "Vegas" && effects[i]["displayName"] != "Write-on") {
        generateCat.push(effects[i]["matchName"]);
        }
        break;
        case "Stylize":
        styleCat.push(effects[i]["matchName"]);
        break;
        case "Distort":
        distortCat.push(effects[i]["matchName"]);
        break;
        case "Color Correction":
        colourCat.push(effects[i]["matchName"]);
        break;
        case "Blur & Sharpen":
        blurCat.push(effects[i]["matchName"]);
        break;
        }
    }

var randomNum;
var compCounter = 1;
var numBackgrounds = 50;

app.beginUndoGroup("Background Generation");

app.beginSuppressDialogs();
for(var i = 1; i <= numBackgrounds; i++) {
    randomNum = Math.floor(Math.random() * 5);
    generateBackground(randomNum, 1920, 1080, 10, 30, Folder("~/Desktop/bgs"));
    compCounter++;
    }
app.endUndoGroup();
app.endSuppressDialogs(false);
app.project.renderQueue.queueInAME(true);


function generateBackground(numEffectsToApply, compWidth, compHeight, duration, frameRate, exportFolder) {
    var backgroundComp = app.project.items.addComp("Random BG " + compCounter, compWidth, compHeight, 1, duration, frameRate);
    var baseSolidLayer = backgroundComp.layers.addSolid([0, 0, 0], "Base Layer", backgroundComp.width, backgroundComp.height, 1, backgroundComp.duration);
    
    var generationEffect = baseSolidLayer.Effects.addProperty(generateCat[Math.floor(Math.random() * generateCat.length)]);
    randomiseEffectValues(generationEffect);
    
    var adjustmentLayer = backgroundComp.layers.addSolid([1, 1, 1], "Overlay FX", backgroundComp.width, backgroundComp.height, 1, backgroundComp.duration);
    adjustmentLayer.adjustmentLayer = true;
    
    var currentOverlayEffect;
    var rand;
    for(var e = 1; e <= numEffectsToApply; e++) {
        rand = Math.floor(Math.random() * 3);
        switch(rand) {
            case 0:
            // "Stylize"
            currentOverlayEffect = adjustmentLayer.Effects.addProperty(styleCat[Math.floor(Math.random() * styleCat.length)]);
            break;
            case 1:
            // "Distort"
            currentOverlayEffect = adjustmentLayer.Effects.addProperty(distortCat[Math.floor(Math.random() * distortCat.length)]);
            break;
            case 2:
            // "Colour Correction"
            currentOverlayEffect = adjustmentLayer.Effects.addProperty(colourCat[Math.floor(Math.random() * colourCat.length)]);
            break;
            }
        if(currentOverlayEffect.name.indexOf("Upscale") != -1 || currentOverlayEffect.name.indexOf("Motion") != -1 || currentOverlayEffect.name.indexOf("Repe") != -1 || currentOverlayEffect.name.indexOf("Stabilize") != -1) {
            currentOverlayEffect.remove();
            } else {
            randomiseEffectValues(currentOverlayEffect);
                }
        }
    
    var blurEffect;
    rand = Math.floor(Math.random() * 3);
    if(rand == 0) {
        blurEffect = adjustmentLayer.Effects.addProperty(blurCat[Math.floor(Math.random() * blurCat.length)]);
        randomiseEffectValues(blurEffect);
        }
    
   // backgroundComp.time = backgroundComp.duration * .5;
   // backgroundComp.openInViewer();
    
    //backgroundComp.saveFrameToPng(backgroundComp.time, File(exportFolder.fsName+"/"+backgroundComp.name+".png"));
    
        var rqItem = app.project.renderQueue.items.add(backgroundComp);
        var module = rqItem.outputModule(1);
        module.file = File(exportFolder.fsName.replace(/%20/g, " ")+"/"+backgroundComp.name+".avi");
    }

//Upscale
// Motion
// RepeTile
// stabilize

function randomiseEffectValues(effect) {
    var tempMin, tempMax;
    var randValue;
        for(var p = 1; p <= effect.numProperties; p++) {
            if(effect.property(p).propertyValueType == PropertyValueType.COLOR) {
                effect.property(p).setValue(generateRandomRGB(false));
                }
            if(effect.property(p).propertyValueType == PropertyValueType.OneD) {
                if(effect.property(p).hasMax && effect.property(p).hasMin) {
                    if(effect.property(p).maxValue > 1) {
                    if(effect.property(p).maxValue > 200) {
                           tempMax = 200; 
                        } else {
                            tempMax = effect.property(p).maxValue;
                            }
                    if(effect.property(p).minValue < 0) {
                            tempMin = 0;
                        } else {
                            tempMin = effect.property(p).minValue;
                            }
                        randValue = Math.floor(Math.random() * tempMax)+1;
                        if(randValue >= effect.property(p).minValue && randValue < effect.property(p).maxValue) {
                    effect.property(p).setValue(randValue);
                    }
                    }
                }
                }
            } 
        }
    
      
function generateRandomRGB(normal) {
    // normal = [0-255]
    if(normal) {
        return [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        } else {
    // not normal = [0.0-1.0]        
        return [Math.random(), Math.random(), Math.random()];
            }
    }
const Pencil = require("./../library/Pencil");
const FileHandler = require("./../library/FileHandler");
let paperHandlerAppendToSpy;
let paperHandlerReadFromSpy;
let paperHandlerWriteSpy;
let pencilHandlerSpy;
let durabilitySpy;
let blankSpaceIndexSpy;
let pencil;

describe("Pencil", function () {
    beforeEach(function () {
        pencil = new Pencil();
    });

    it("should initialize the paper FileHandler", function () {
        expect(pencil.paperFileHandler).toBeInstanceOf(FileHandler);
        expect(pencil.paperFileHandler.fileLocation).toEqual(pencil.paperFileLocation)
    });

    it("should initialize the pencil FileHandler", function () {
        expect(pencil.pencilFileHandler).toBeInstanceOf(FileHandler);
        expect(pencil.pencilFileHandler.fileLocation).toEqual(pencil.pencilFileLocation)
    });

    describe("setDurability", function () {
        beforeEach(function () {
            pencilHandlerSpy = spyOn(pencil.pencilFileHandler, "readFromFile");
        })

        it("should set the pencilDurability from the pencil file if there's data there", function () {
            pencil.pencilDurability = undefined;
            let parseSpy = spyOn(pencil, "parsePencilData").and.returnValue({durability: 15});
            pencil.setDurability();
            expect(parseSpy).toHaveBeenCalledTimes(1);
            expect(pencilHandlerSpy).toHaveBeenCalledTimes(1);
            expect(pencil.pencilDurability).toEqual(15);
        });

        it("should leave the pencilDurability undefined if the pencil file is empty", function () {
            pencil.pencilDurability = undefined;
            let spy = spyOn(pencil, "parsePencilData").and.returnValue({});
            pencil.setDurability();
            expect(spy).toHaveBeenCalled();
            expect(pencil.pencilDurability).toEqual(undefined);
        });

        it("should leave the pencilDurability undefined if the pencil file does not contain a value", function () {
            pencil.pencilDurability = undefined;
            let spy = spyOn(pencil, "parsePencilData").and.returnValue({durability: undefined});
            pencil.setDurability();
            expect(spy).toHaveBeenCalled();
            expect(pencil.pencilDurability).toEqual(undefined);
        });

        it("should set the initial durability from the pencil file if there's data there", function () {
            pencil.initialPencilDurability = undefined;
            let parseSpy = spyOn(pencil, "parsePencilData").and.returnValue({initialDurability: 15});
            pencil.setDurability();
            expect(parseSpy).toHaveBeenCalledTimes(1);
            expect(pencilHandlerSpy).toHaveBeenCalledTimes(1);
            expect(pencil.initialPencilDurability).toEqual(15);
        });

        it("should leave the initial durability undefined if the pencil file is empty", function () {
            pencil.initialPencilDurability = undefined;
            let spy = spyOn(pencil, "parsePencilData").and.returnValue({});
            pencil.setDurability();
            expect(spy).toHaveBeenCalled();
            expect(pencil.initialPencilDurability).toEqual(undefined);
        });

        it("should leave the initial durability undefined if the pencil file does not contain a value", function () {
            pencil.initialPencilDurability = undefined;
            let spy = spyOn(pencil, "parsePencilData").and.returnValue({initialDurability: undefined});
            pencil.setDurability();
            expect(spy).toHaveBeenCalled();
            expect(pencil.initialPencilDurability).toEqual(undefined);
        });

        it("should set the eraser durability from the pencil file if there's data there", function () {
            pencil.eraserDurability = undefined;
            let parseSpy = spyOn(pencil, "parsePencilData").and.returnValue({eraserDurability: 15});
            pencil.setDurability();
            expect(parseSpy).toHaveBeenCalledTimes(1);
            expect(pencilHandlerSpy).toHaveBeenCalledTimes(1);
            expect(pencil.eraserDurability).toEqual(15);
        });

        it("should leave the eraser durability undefined if the pencil file is empty", function () {
            pencil.eraserDurability = undefined;
            let spy = spyOn(pencil, "parsePencilData").and.returnValue({});
            pencil.setDurability();
            expect(spy).toHaveBeenCalled();
            expect(pencil.eraserDurability).toEqual(undefined);
        });

        it("should leave the eraser durability undefined if the pencil file does not contain a value", function () {
            pencil.eraserDurability = undefined;
            let spy = spyOn(pencil, "parsePencilData").and.returnValue({eraserDurability: undefined});
            pencil.setDurability();
            expect(spy).toHaveBeenCalled();
            expect(pencil.eraserDurability).toEqual(undefined);
        });
    });

    describe("create", function () {
        beforeEach(function () {
            pencilHandlerSpy = spyOn(pencil.pencilFileHandler, "storePencilState");
        });

        it("should set the eraserDurability", function () {
            pencil.create(undefined, 5);
            expect(pencil.eraserDurability).toEqual(5);
        });

        it("should set the pencilDurability", function () {
            pencil.create(10);
            expect(pencil.pencilDurability).toEqual(10);
        });

        it("should set the initialPencilDurability", function () {
            pencil.create(10);
            expect(pencil.initialPencilDurability).toEqual(10);
        });

        it("should store the pencil's state", function () {
            pencil.create(10, 5);
            expect(pencilHandlerSpy).toHaveBeenCalledWith(10, 10, 5);
        });
    });

    describe("erase", function () {
        beforeEach(function () {
            paperHandlerReadFromSpy = spyOn(pencil.paperFileHandler, "readFromFile")
                .and.returnValue('teststufftextstufftext');
            paperHandlerWriteSpy = spyOn(pencil.paperFileHandler, "writeToFileFromScratch");
            pencilHandlerSpy = spyOn(pencil.pencilFileHandler, "storePencilState");
            pencil.eraserDurability = 5;
            durabilitySpy = spyOn(pencil, "setDurability");
        });

        it("should erase the last instance of specified text from a string", function () {
            pencil.erase('stuff');
            expect(paperHandlerWriteSpy).toHaveBeenCalledWith('teststufftext     text');
            expect(paperHandlerReadFromSpy).toHaveBeenCalled();
        });

        it("should stop erasing when the eraser is degraded", function () {
            pencil.erase('stuffte');
            expect(paperHandlerWriteSpy).toHaveBeenCalledWith('teststufftextst     xt');
            expect(paperHandlerReadFromSpy).toHaveBeenCalled();
        });

        it("should write the pencil's current state to temporary storage", function () {
            pencil.initialPencilDurability = 10;
            pencil.pencilDurability = 10;
            pencil.eraserDurability = 5;
            pencil.erase("test");
            expect(pencilHandlerSpy).toHaveBeenCalledWith(10, 10, 1);
            expect(pencilHandlerSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("sharpen", function () {
        beforeEach(function () {
            pencilHandlerSpy = spyOn(pencil.pencilFileHandler, "storePencilState");
            durabilitySpy = spyOn(pencil, "setDurability");
        });

        it("should retrieve the stored pencil data from the file", function () {
            pencil.sharpen();
            expect(durabilitySpy).toHaveBeenCalled();
        });

        it("should store the pencil's state using initial pencilDurability", function () {
            pencil.initialPencilDurability = 10;
            pencil.pencilDurability = 5;
            pencil.eraserDurability = 3
            pencil.sharpen();
            expect(pencilHandlerSpy).toHaveBeenCalledWith(10, 10, 3);
        });
    });

    describe("write", function () {
        beforeEach(function() {
            paperHandlerAppendToSpy = spyOn(pencil.paperFileHandler, "appendToFile");
            pencilHandlerSpy = spyOn(pencil.pencilFileHandler, "storePencilState");
            durabilitySpy = spyOn(pencil, "setDurability");
        });

        it("should pass the text to the FileHandler to write", function () {
            let text = "test data";
            pencil.pencilDurability = undefined;

            pencil.write(text);
            expect(paperHandlerAppendToSpy).toHaveBeenCalledWith(text);
        });

        it("should determine which text can be written if the pencilDurability is defined", function () {
            pencil.pencilDurability = 8;
            let writableTextSpy = spyOn(pencil, "getWritableText");

            pencil.write("test data");
            expect(writableTextSpy).toHaveBeenCalled();
        });

        it("should not determine which text can be written if the pencilDurability is not defined", function () {
            let writableTextSpy = spyOn(pencil, "getWritableText");
            pencil.pencilDurability = undefined;

            pencil.write("test data");
            expect(writableTextSpy).not.toHaveBeenCalled();
        });

        it("should write the pencil's current state to temporary storage", function () {
            pencil.initialPencilDurability = 10;
            pencil.pencilDurability = 10;
            pencil.eraserDurability = 3;
            pencil.write("test data");
            expect(pencilHandlerSpy).toHaveBeenCalledWith(2, 10, 3);
            expect(pencilHandlerSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("edit", function () {
        beforeEach(function() {
            paperHandlerReadFromSpy = spyOn(pencil.paperFileHandler, "readFromFile")
                .and.returnValue('te  st  ata');
            paperHandlerAppendToSpy = spyOn(pencil.paperFileHandler, "writeToFileFromScratch");
            pencilHandlerSpy = spyOn(pencil.pencilFileHandler, "storePencilState");
            durabilitySpy = spyOn(pencil, "setDurability");
            blankSpaceIndexSpy = spyOn(pencil, "getLastBlankSpaceIndex").and.returnValue(7);
        });

        it("should read the existing text from local storage", function () {
            pencil.edit('test');
            expect(paperHandlerReadFromSpy).toHaveBeenCalled();
        });

        it("should pass the text to the FileHandler to write", function () {
            pencil.pencilDurability = undefined;

            pencil.edit("aaa");
            expect(paperHandlerAppendToSpy).toHaveBeenCalledWith('te  st a@@a');
        });

        it("should determine which text can be written if the pencilDurability is defined", function () {
            pencil.pencilDurability = 8;
            let writableTextSpy = spyOn(pencil, "getWritableText").and.returnValue('aaa');

            pencil.edit("aaa");
            expect(writableTextSpy).toHaveBeenCalled();
        });

        it("should not determine which text can be written if the pencilDurability is not defined", function () {
            let writableTextSpy = spyOn(pencil, "getWritableText");
            pencil.pencilDurability = undefined;

            pencil.edit("aaa");
            expect(writableTextSpy).not.toHaveBeenCalled();
        });

        it("should write the pencil's current state to temporary storage", function () {
            pencil.initialPencilDurability = 10;
            pencil.pencilDurability = 10;
            pencil.eraserDurability = 3;
            pencil.edit("aaa");
            expect(pencilHandlerSpy).toHaveBeenCalledWith(7, 10, 3);
            expect(pencilHandlerSpy).toHaveBeenCalledTimes(1);
        });

        it("should not edit anything if nothing has been erased", function () {
            blankSpaceIndexSpy.and.returnValue(-1);
            pencil.pencilDurability = undefined;
            paperHandlerReadFromSpy.and.returnValue('test data');

            pencil.edit("aaa");
            expect(paperHandlerAppendToSpy).not.toHaveBeenCalled();
        });
    });

    describe("getLastBlankSpaceIndex", function () {
        it("should return -1 if there are no consecutive spaces", function () {
            let result = pencil.getLastBlankSpaceIndex('test test test');
            expect(result).toEqual(-1);
        });

        it("should return the  index of the second space in series of consecutive spaces", function () {
            let result = pencil.getLastBlankSpaceIndex('test  test  test');
            expect(result).toEqual(11);
        });
    });

    describe("getWritableText", function () {
        beforeEach(function() {
            paperHandlerAppendToSpy = spyOn(pencil.paperFileHandler, "appendToFile");
            pencilHandlerSpy = spyOn(pencil.pencilFileHandler, "appendToFile");
        });

        it("should degrade the pencil for each character", function () {
            pencil.pencilDurability = 8;
            let degradePencilSpy = spyOn(pencil, "degradePencil");

            pencil.getWritableText("test data");
            expect(degradePencilSpy).toHaveBeenCalledTimes(9);
        });

        it("should return the text it was passed if the pencil does not degrade", function () {
            pencil.pencilDurability = 8;

            expect(pencil.getWritableText("test data")).toEqual("test data");
        });

        it("should blank the correct number of characters when the pencil degrades", function () {
            pencil.pencilDurability = 8;

            expect(pencil.getWritableText("test data more")).toEqual("test data     ");
        });
    });

    describe("isSpace", function () {
        it("should return true if the character is a space", function () {
            expect(pencil.isSpace(" ")).toBeTrue();
        });

        it("should return false if the character is not a space", function () {
            expect(pencil.isSpace("n")).toBeFalse();
            expect(pencil.isSpace("1")).toBeFalse();
            expect(pencil.isSpace("$")).toBeFalse();
        })
    });

    describe("isNumber", function () {
        it("should return true if the character is a number", function () {
            expect(pencil.isNumber("1")).toBeTrue();
            expect(pencil.isNumber("2")).toBeTrue();
            expect(pencil.isNumber("3")).toBeTrue();
        });

        it("should return false if the character is not a number", function () {
            expect(pencil.isNumber("n")).toBeFalse();
            expect(pencil.isNumber(" ")).toBeFalse();
            expect(pencil.isNumber("$")).toBeFalse();
        })
    });

    describe("isSpecialCharacter", function () {
        it("should return true if the character is a special character", function () {
            expect(pencil.isSpecialCharacter("$")).toBeTrue();
            expect(pencil.isSpecialCharacter("%")).toBeTrue();
            expect(pencil.isSpecialCharacter("`")).toBeTrue();
        });

        it("should return false if the character is not a special character", function () {
            expect(pencil.isSpecialCharacter("n")).toBeFalse();
            expect(pencil.isSpecialCharacter(" ")).toBeFalse();
            expect(pencil.isSpecialCharacter("3")).toBeFalse();
        })
    });

    describe("isLowerCase", function () {
        it("should return true if the character is lower case", function () {
            expect(pencil.isLowerCase("a")).toBeTrue();
            expect(pencil.isLowerCase("p")).toBeTrue();
            expect(pencil.isLowerCase("i")).toBeTrue();
        });

        it("should return false if the character is not lower case", function () {
            expect(pencil.isLowerCase("A")).toBeFalse();
            expect(pencil.isLowerCase("P")).toBeFalse();
            expect(pencil.isLowerCase("I")).toBeFalse();
        })
    });

    describe("isUpperCase", function () {
        it("should return true if the character is upper case", function () {
            expect(pencil.isUpperCase("A")).toBeTrue();
            expect(pencil.isUpperCase("P")).toBeTrue();
            expect(pencil.isUpperCase("I")).toBeTrue();
        });

        it("should return false if the character is not upper case", function () {
            expect(pencil.isUpperCase("a")).toBeFalse();
            expect(pencil.isUpperCase("p")).toBeFalse();
            expect(pencil.isUpperCase("i")).toBeFalse();
        })
    });

    describe("degradePencil", function () {
        it("should not degrade the pencil when writing a space", function () {
            pencil.pencilDurability = 2;
            let spy = spyOn(pencil, "isSpace").and.returnValue(true);
            pencil.degradePencil(" ");
            expect(pencil.pencilDurability).toEqual(2);
        });

        it("should degrade the pencil by 1 point when writing a numeral", function () {
            pencil.pencilDurability = 2;
            let spy = spyOn(pencil, "isNumber").and.returnValue(true);
            pencil.degradePencil("1");
            expect(pencil.pencilDurability).toEqual(1);
        });

        it("should degrade the pencil by 1 point when writing a special character", function () {
            pencil.pencilDurability = 2;
            let spy = spyOn(pencil, "isSpecialCharacter").and.returnValue(true);
            pencil.degradePencil("%");
            expect(pencil.pencilDurability).toEqual(1);
        });

        it("should degrade the pencil by 1 point when writing a lowercase letter", function () {
            pencil.pencilDurability = 2;
            let spy = spyOn(pencil, "isLowerCase").and.returnValue(true);
            pencil.degradePencil("a");
            expect(pencil.pencilDurability).toEqual(1);
        });

        it("should degrade the pencil by 2 points when writing an uppercase letter", function () {
            pencil.pencilDurability = 2;
            let spy = spyOn(pencil, "isUpperCase").and.returnValue(true);
            pencil.degradePencil("A");
            expect(pencil.pencilDurability).toEqual(0);
        });
    });
});

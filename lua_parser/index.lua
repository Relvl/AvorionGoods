local avorionVersion = "1.3.8-beta"
local outputDir = "../src/app/generated/"
-- Load Avorion's scripts. Change this paths.
dofile("D:\\_STEAM\\steamapps\\common\\Avorion\\data\\scripts\\lib\\productionsindex.lua")
dofile("D:\\_STEAM\\steamapps\\common\\Avorion\\data\\scripts\\lib\\goodsindex.lua")

local json = require "json"
local lfs = require "lfs"
---------------------------------------------------------------------
lfs.mkdir(outputDir)

function writeJsonExport(fileName, struct, fixArrays)
    local file, err = io.open(outputDir .. fileName .. ".ts", 'w')
    if file then
        file:write("import {type_" .. fileName .. "} from \"./interface/type_" .. fileName .. "\";\n")
        file:write("export const " .. fileName .. ": type_" .. fileName .. " = ")

        local output = ""
        if (fixArrays) then
            local js, count = json.stringify(struct):gsub("{}", "[]")
            output = js
        else
            output = json.stringify(struct)
        end

        file:write(output)
        file:write(";")
        file:close()
        print("Safing file " .. fileName .. " - done")
    else
        print("error:", err) -- not so hard?
    end
end

local function starts_with(str, start)
    return str:sub(1, #start) == start
end

local function ends_with(str, ending)
    return ending == "" or str:sub(-#ending) == ending
end

writeJsonExport("productionsindex", productions, true)
writeJsonExport("goodsindex", goods)

local localisationRaw = {};
for file in lfs.dir [[D:\_STEAM\steamapps\common\Avorion\data\localization]] do
    if ends_with(file, ".po") then
        local lang = file:sub(1, #file - 3)
        print("found locale " .. lang)
        localisationRaw[lang] = {}

        local ioFile = io.open([[D:\_STEAM\steamapps\common\Avorion\data\localization\]] .. file)
        local i = 0
        local lines = {}
        for line in ioFile:lines() do
            lines[i] = tostring(line)
            i = i + 1
        end
        ioFile:close()

        for idx, line in pairs(lines) do
            if starts_with(line, "msgid ") then
                local msgid = line:sub(#"msgid " + 2, #line - 1)
                local nextLine = lines[idx + 1]
                local prevLine = lines[idx - 1]
                if prevLine ~= "msgctxt \"Color Name\"" and starts_with(nextLine, "msgstr ") then
                    local msgstr = nextLine:sub(#"msgstr " + 2, #nextLine - 1)
                    localisationRaw[lang][msgid] = msgstr
                end
            end
        end
    end
end
writeJsonExport("localisationRaw", localisationRaw)

print("---------- done!")
"use strict";
// This plugin creates 5 rectangles on the screen.
// const numberOfRectangles = 3
// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).
let nextMessageIndex = 1;
const resolveByMessageIndex = {};
figma.showUI(`
<script>
  window.onmessage = async (event) => {
    const { messageIdx, cssStr, scssAKA, cbArray } = event.data.pluginMessage
    // Do code generation here:
    parent?.postMessage(
      {
        pluginMessage: {
          type: "RESULT",
          result: cssStr,messageIdx,scssAKA,cbArray
        },
      },
      "*"
    );
  }
</script>
`, { visible: false, themeColors: true });
figma.ui.on("message", (msg) => {
    var _a;
    if (msg.type === "RESULT") {
        const shapes = [];
        const msg_c = msg.result.replace(/(-?\d+(\.\d+)?)px/g, "vwcalc($1)");
        console.log(msg);
        msg.cbArray.forEach((x) => {
            shapes.push({
                language: "PLAINTEXT",
                // code: msg.scssText,
                code: x['@include'],
                title: x['text'],
            });
            shapes.push({
                language: "PLAINTEXT",
                // code: msg.scssText,
                code: x['color'],
                title: "[color] " + x['text'],
            });
        });
        shapes.push({
            language: "PLAINTEXT",
            code: msg_c,
            title: "original",
        });
        console.log(shapes);
        (_a = resolveByMessageIndex[msg.messageIdx]) === null || _a === void 0 ? void 0 : _a.call(resolveByMessageIndex, shapes);
        delete resolveByMessageIndex[msg.messageIdx];
    }
});
figma.codegen.on("generate", async ({ node }) => {
    const messageIdx = nextMessageIndex++;
    console.log(node);
    console.log(messageIdx);
    return new Promise(async (resolve) => {
        const cssProps = await node.getCSSAsync();
        const cssStr = Object.entries(cssProps)
            .map(([k, v]) => `${k}: ${v};`)
            .join("\n");
        resolveByMessageIndex[messageIdx] = resolve;
        if (node.type === "TEXT") {
            ;
            // let uniqueArray = node.getStyledTextSegments(['fontSize','lineHeight','fontWeight','letterSpacing','fills']).filter(
            //   (value:any, index, self) => self.findIndex((obj) => 
            //     obj.fontSize === value.fontSize &&
            //     obj.lineHeight.unit === value.lineHeight.unit && 
            //     obj.lineHeight?.value === value.lineHeight.value && 
            //     obj.fontWeight === value.fontWeight && 
            //     obj.letterSpacing.unit === value.letterSpacing.unit && 
            //     obj.letterSpacing.value === value.letterSpacing.value
            //   ) === index
            // );
            let uniqueArray = node.getStyledTextSegments(['fontSize', 'lineHeight', 'fontWeight', 'letterSpacing', 'fills']).filter((value, index, self) => self.findIndex((obj) => {
                if (obj.lineHeight.unit === "AUTO") {
                    return obj.fontSize === value.fontSize &&
                        obj.lineHeight.unit === value.lineHeight.unit &&
                        obj.fontWeight === value.fontWeight &&
                        obj.letterSpacing.unit === value.letterSpacing.unit &&
                        obj.letterSpacing.value === value.letterSpacing.value;
                }
                return obj.fontSize === value.fontSize &&
                    obj.lineHeight.unit === value.lineHeight.unit &&
                    obj.lineHeight.value === value.lineHeight.value &&
                    obj.fontWeight === value.fontWeight &&
                    obj.letterSpacing.unit === value.letterSpacing.unit &&
                    obj.letterSpacing.value === value.letterSpacing.value;
            }) === index);
            console.log(uniqueArray);
            console.log('777');
            const cbArray = [];
            uniqueArray.forEach(x => {
                let scssA = {};
                // console.log(x);
                scssA['font-size'] = x.fontSize;
                if (x.lineHeight.unit === "AUTO") {
                    scssA['line-height'] = `100%`;
                }
                else if (x.lineHeight.unit === "PERCENT") {
                    scssA['line-height'] = `${Math.round(x.lineHeight.value)}%`;
                }
                else {
                    scssA['line-height'] = x.lineHeight.value;
                }
                scssA['font-weight'] = x.fontWeight;
                if (x.letterSpacing.value === 0) {
                    scssA['letter-spacing'] = 0;
                }
                else if (x.letterSpacing.unit === "PERCENT") {
                    scssA['letter-spacing'] = Math.round(x.fontSize / 100 * x.letterSpacing.value);
                }
                else {
                    scssA['letter-spacing'] = x.letterSpacing.value;
                }
                scssA['text'] = x.characters;
                scssA['@include'] = `@include fontStyle(${scssA['font-size']}, ${scssA['line-height']}, ${scssA['font-weight']}, ${scssA['letter-spacing']});`;
                if (x.fills[0].type !== "SOLID") {
                    0;
                }
                else {
                    const hexColor = rgbToHex(Math.round(x.fills[0].color.r * 255), Math.round(x.fills[0].color.g * 255), Math.round(x.fills[0].color.b * 255));
                    scssA['color'] = `color: ${hexColor};`;
                }
                cbArray.push(scssA);
                function rgbToHex(r, g, b) {
                    // 将每个颜色分量转换为十六进制，并确保它们的长度为两个字符
                    const toHex = (c) => {
                        const hex = c.toString(16);
                        return hex.length == 1 ? "0" + hex : hex;
                    };
                    // 将 RGB 分量转换为十六进制表示形式
                    const hexR = toHex(r);
                    const hexG = toHex(g);
                    const hexB = toHex(b);
                    // 返回十六进制表示形式的颜色
                    return `#${hexR}${hexG}${hexB}`;
                }
            });
            figma.ui.postMessage({
                messageIdx,
                cssStr,
                // scssText,
                cbArray
            });
        }
        else {
            // const scssText = "";
            const cbArray = [];
            figma.ui.postMessage({
                messageIdx,
                cssStr,
                cbArray
                // scssText,
            });
        }
    });
});

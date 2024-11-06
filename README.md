以下是使插件运行的步骤。您还可以找到以下说明：

  https://www.figma.com/plugin-docs/plugin-quickstart-guide/

该插件模板使用Typescript和NPM，这是创建JavaScript应用程序的两个标准工具。

首先，下载npm随附的node.js。这将允许您安装打字稿和其他
库。您可以在此处找到下载链接：

  https://nodejs.org/en/download/

接下来，使用命令安装打字稿：

  NPM安装-G打字稿

最后，在插件的目录中，通过运行获取插件API的最新类型定义：

  NPM安装-Save-dev @figma/插件类型

如果您熟悉JavaScript，那么打字稿看起来会非常熟悉。实际上，有效的JavaScript代码
是有效的打字稿代码。

打字稿将类型注释添加到变量。这允许代码编辑器，例如Visual Studio代码
在编写代码时提供有关FIGMA API的信息，并帮助捕获错误
您以前没有注意到。

有关更多信息，请访问https://www.typescriptlang.org/

使用TypeScript需要编译器将TypeScript（code.ts）转换为JavaScript（code.js）
浏览器运行。

我们建议使用Visual Studio代码编写打字稿代码：

1.如果尚未下载Visual Studio代码：https：//code.visualstudio.com/。
2.在Visual Studio代码中打开此目录。
3.编译打字稿到JavaScript：运行“终端>运行构建任务...”菜单项，
    然后选择“ NPM：观看”。您每次都必须再次执行此操作
    您重新打开了Visual Studio代码。

就是这样！每次保存时，Visual Studio Code都会重新生成JavaScript文件。
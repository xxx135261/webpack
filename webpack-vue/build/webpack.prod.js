const webpack = require('webpack');
const path = require('path');
const webpackBaseConfig = require('./webpack.base');
const WebpackMerge = require('webpack-merge');

// css分离
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

// 优化配置，分别是压缩js，压缩css的插件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

//将预先打包好的第三方库与其他包进行整合
const libPath = path.resolve(__dirname, '../libs');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

module.exports = WebpackMerge(webpackBaseConfig,{
	mode:'production',
	module:{
		rules:[{
			test: /\.vue$/,
			use:['thread-loader','vue-loader']
		},{
			test:/\.scss$/,
			use:[MiniCssExtractPlugin.loader,'css-loader','postcss-loader','sass-loader']
		},{
			test: /\.css$/,
			use: [MiniCssExtractPlugin.loader,'happypack/loader?id=css']  //加速打包, 原：[miniCssExtractPlugin.loader,'css-loader', 'postcss-loader']
		}]
	},
	plugins:[
		// 分离css
		new MiniCssExtractPlugin({
			filename:'css/[name].[hash:8].css',
			chunkFilename:"css/[name].[chunkhash:8].css" //被分离的文件名
		}),
		//clean-webpack-plugin会先清除dist文件夹下所有的内容，进入下一阶段
		new CleanWebpackPlugin(),
		// 压缩js,css
		new OptimizeCssAssetsPlugin(),
		new UglifyJsPlugin({
			parallel:true, //开启多线程压缩
			cache:true,    //使用缓存
			uglifyOptions: {
				warnings:false,  //删除警告
				compress: {
					drop_console: true, //去除日志
					drop_debugger: true, //去除debugger
				},
				output: {
					comments: false   //去除注释
				}
			}
		}),
		//dllReferencePlugin是对第三方库manifest.json的引用，可以通过此文件排除已打包好的内容，
		new webpack.DllReferencePlugin({
			context: __dirname,
			manifest: require('../libs/lib-manifest.json')
		  }),
		//将打包好的第三方库复制到目标目录下
  		new AddAssetHtmlPlugin({
			filepath: path.resolve(libPath, '*.js'),
			outputPath: 'js'
	  	})
	],
})
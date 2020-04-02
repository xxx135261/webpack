// webpack.base.js
const path = require('path');
const entryPath = path.resolve(__dirname, '../src/index.js');
const outputPath = path.resolve(__dirname, '../dist');
const htmlPath = path.resolve(__dirname, '../public/index.html');

//js的node环境是单线程，happypack主要通过开启多个进程来加快打包过程，并不是绝对加快，
//thread-loader也是同样的作用，需要加在被加速的loader的前面
const HappyPack = require('happypack');
const HappyThreadPool = HappyPack.ThreadPool({ size: 2 });

const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		app: entryPath
	},
	output: {
		path: outputPath,
		filename: 'js/[name].[hash:8].js',
    	publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: 'happypack/loader?id=babel',
				exclude: /node_modules/
			},
			{
				test: /\.(png|jpg|gif|svg|ttf|eot|woff|otf)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: 'assets/[name].[hash:8].[ext]'
						}
					}
				]
			}
		]
	},
	plugins: [
		new VueLoaderPlugin(),
		// 根据源html文件生成同样的html文件，并将打包生成的js、css文件自动引入到生成的html文件中。
		new HtmlWebpackPlugin({
			template:htmlPath,
			filename:'index.html',
			minify:true
		}),
		// 加速打包
		new HappyPack({
			id: 'css',
			threadPool: HappyThreadPool,
			loaders: ['css-loader', 'postcss-loader'],
    		}),
		new HappyPack({
			id: 'babel',
			loaders: ['babel-loader'],
			threadPool: HappyThreadPool,
		}),
	],
	//optimization来配置缓存组等优化配置
	optimization: {
		runtimeChunk: 'single',   //runtimeChunk将各个chunk运行时文件单独打包出来
		splitChunks: {			  //开启缓存组,对node_modules进行缓存复用
			cacheGroups: {
			vendors: {
				name: "vendors",
				test: /[\\/]node_modules[\\/]/,
				chunks: "all",
				priority: -10,
				reuseExistingChunk: true,
			},
			}
		}
	},
}
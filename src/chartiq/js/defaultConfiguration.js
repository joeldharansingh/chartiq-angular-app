/**!
 *	8.9.2
 *	Generation date: 2023-05-22T15:27:11.767Z
 *	Client name: enrich commodities india pvt limited
 *	Package Type: Core alacarte
 *	License type: annual
 *	Expiration date: "2024/12/01"
 *	Domain lock: ["127.0.0.1","localhost","enrichbroking.in","enrichbroking.com","enrichmoney.in"]
 */

/***********************************************************!
 * Copyright by ChartIQ, Inc.
 * Licensed under the ChartIQ, Inc. Developer License Agreement https://www.chartiq.com/developer-license-agreement
*************************************************************/
/*************************************! DO NOT MAKE CHANGES TO THIS LIBRARY FILE!! !*************************************
* If you wish to overwrite default functionality, create a separate file with a copy of the methods you are overwriting *
* and load that file right after the library has been loaded, but before the chart engine is instantiated.              *
* Directly modifying library files will prevent upgrades and the ability for ChartIQ to support your solution.          *
*************************************************************************************************************************/
/* eslint-disable no-extra-parens */


import {CIQ} from "../js/chartiq.js";
	// Available resources:
	// markerFeed
	// scrollStyle
	// quoteFeed
	// forecastQuoteFeed
	// nameValueStore
	function getConfig(resources = {}) {
		let config = {
			// Symbol can be string or
			// or an object containing property symbol of string type along with other properties
			initialSymbol: {
				symbol: "AAPL",
				name: "Apple Inc",
				exchDisp: "NASDAQ"
			},
			// highest common ancestor node for this chart
			root: document,
			// initial data array, if any
			initialData: undefined,
			// List of addons which are enabled and will be started when chart is created
			// Either override or supplement this list before creating chart to modify.
			enabledAddOns: {
				animation: false,
				continuousZoom: false,
				outliers: false,
				plotComplementer: false,
				dataLoader:true,
				extendedHours: true,
				fullScreen: true,
				inactivityTimer: true,
				rangeSlider: true,
				shortcuts: true,
				tableView: true,
				tooltip: true
			},
			onNewSymbolLoad: {
				// if available called for each series in chart to test if it needs to be removed
				// when new primary symbol is loaded
				removeSeries(series) {
					return series.parameters.bucket !== "study"; // keeps only studies
				},
				// handle symbol load error
				loadError(error, uiContext) {
				}
			},
			// configure save and restore layout, preferences and drawings.
			// type is boolean or object
			// setting `restore: { symbol: false }` will restore everything except symbol
			restore: true,
			// language: "de", // Optionally set a language for the UI, after it has been initialized, and translate.
			// default lookup driver is defined in examples/feeds/symbolLookupChartIQ.js, it needs to be loaded to be available
			lookupDriver: CIQ.ChartEngine.Driver.Lookup.ChartIQ,
			hotkeyConfig: {
				// Specify hotkeys for default hotkey actions. Structure of the API works like this: each hotkey gets initialized with an
				// object that specifies the action to be performed and the command(s) to trigger it. Actions identified as strings are
				// default actions, which in some cases can be modified in the `hotkeyConfig.behavior` object. For custom actions, actions
				// can be set to functions, which will get called with an object with references to `stx` and `options` (an optional object
				// specified in the hotkey declaration).
				// Commands are specified as strings, with combo keys separated by `+`. For combos, all keys but the last key are expected
				// to be modifier keys (Shift, Alt, etc). The hotkey handler will check both `KeyboardEvent.key` and `KeyboardEvent.code`,
				// which can be useful when trying to ensure coverage across systems and layouts. If the keystroke originated on the numpad,
				// only `KeyboardEvent.code` will be checked, allowing different hotkeys to be assigned to the numpad.
				// Vertical movement options accept a percent option (expressed as a decimal), which specifies vertical movement as a
				// percentage of the chart height. Horizontal movement accepts a bars option, which specifies number of bars to move.
				// Note: if a `KeyboardEvent.key` value is equal to "Unidentified", the `String.fromCharCode` of the `KeyboardEvent.keyCode`
				// value will be used instead. This is to support legacy edge.
				hotkeys: [
					// precise navigation
					{ label: "Pan chart up", action: "up", options: { percent: 0.02 }, commands: ["ArrowUp", "Up"] },
					{ label: "Pan chart down", action: "down", options: { percent: 0.02 }, commands: ["ArrowDown", "Down"] },
					{ label: "Pan chart right", action: "right", options: { bars: 1 }, commands: ["ArrowRight", "Right"] },
					{ label: "Pan chart left", action: "left", options: { bars: 1 }, commands: ["ArrowLeft", "Left"] },
					// fast navigation
					{ label: "Pan chart up fast", action: "up", options: { percent: 0.2 }, commands: ["Shift+ArrowUp", "Shift+Up"] },
					{ label: "Pan chart down fast",  action: "down", options: { percent: 0.2 }, commands: ["Shift+ArrowDown", "Shift+Down"] },
					{ label: "Pan chart right fast", action: "right", options: { bars: 10 }, commands: ["Shift+ArrowRight", "Shift+Right"] },
					{ label: "Pan chart left fast", action: "left", options: { bars: 10 }, commands: ["Shift+ArrowLeft", "Shift+Left"] },
					// page
					{ label: "Page chart right", action: "pageRight", commands: ["Alt+ArrowRight", "Alt+Right", "PageUp"] },
					{ label: "Page chart left", action: "pageLeft", commands: ["Alt+ArrowLeft", "Alt+Left", "PageDown"] },
					// zoom
					{ label: "Zoom in x-axis", action: "zoomInXAxis", commands: ["NumpadAdd", "="] },
					{ label: "Zoom out x-axis", action: "zoomOutXAxis", commands: ["NumpadSubtract", "-"] },
					{ label: "Zoom in y-axis", action: "zoomInYAxis", commands: ["+"] },
					{ label: "Zoom out y-axis", action: "zoomOutYAxis", commands: ["_"] },
					// toggle
					{ label: "Toggle crosshair", action: "toggleCrosshairs", commands: ["Alt+Backslash", "Alt+\\", "Alt+Þ"] }, // Alt+Þ for legacy edge support
					{ label: "Toggle continuous zoom", action: "toggleContinuousZoom", commands: ["Alt+Digit0", "Alt+0"], extension: "continuousZoom" },
					// UI navigation
					{ label: "Tab to next", action: "keyboardNavigateNext", commands: ["Tab"] },
					{ label: "Tab to previous", action: "keyboardNavigatePrevious", commands: ["Shift+Tab"] },
					// Tab navigation deselect is available. Comment out this line and assign an open key combination to enable.
					//{ label: "Deactivate Tab Selection", action: "keyboardNavigateDeselect", commands: [""] },
					{ label: "Select at tab", action: "keyboardNavigateClick", commands: ["Enter"] },
					// misc
					{ label: "Pan to home", action: "home", commands: ["Home"] },
					{ label: "Pan to start of loaded data", action: "end", commands: ["End"] },
					{ label: "Delete a highlighted item or the active drawing", action: "delete", commands: ["Backspace", "Delete", "Del"] },
					{ label: "Close an open menu / dialog box or undo the active drawing", action: "escape", commands: ["Escape", "Esc"] },
					{ label: "Symbol Lookup", action: "symbolLookup", commands: ["Shift+Alt+KeyL"], ariaLabel: "Opens main symbol lookup for chart" },
					// AddOns and Plugins
					{ label: "Table view", action: "tableView", commands: ["Alt+KeyK"], extension: "tableView", ariaLabel: "Opens chart data in table format" }, // tableView is modal view, toggling off requires use of Escape
					{ label: "Range Slider", action: "rangeSlider", commands: ["Shift+Alt+KeyR"], extension: "rangeSlider" },
					{ label: "Extended Hours", action: "extendedHours", commands: ["Shift+Alt+KeyX"], extension: "extendedHours" },
					{ label: "Keyboard Shortcuts", action: "shortcuts", commands: ["Shift+Alt+Slash", "Shift+Alt+?"], extension: "shortcuts" },
					{ label: "Outliers", action: "outliers", commands: ["Shift+Alt+KeyO"], extension: "outliers" },
					{ label: "Market Depth", action: "marketDepth", commands: ["Shift+Alt+KeyD"], extension: "marketDepth" },
					{ label: "L2 Heat Map", action: "l2HeatMap", commands: ["Shift+Alt+KeyM"], extension: "marketDepth" },
					{ label: "Import Data", action: "dataLoader", commands: ["Alt+KeyI"], extension: "dataLoader" },
					{ label: "Trade From Chart", action: "tfc", commands: ["Shift+Alt+KeyP"], extension: "tfc" }
				],
				// Keys events captured by the chart normally trigger on keyup. Specify which keys will trigger on keydown,
				// allowing a user to hold said key down (which keeps generating events) to repeat the associated hotkey action. It is
				// not recommended to associate "toggle" actions with these keys.
				keysToRepeat: [
					"ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
					"Up", "Down", "Left", "Right", "-", "_", "=", "+"
				],
			},
			systemMessages: {
				// Predefined notification event objects to be called by key value. Example:
				// testinfo: {
				// 	message: "This is an \"informational\" notification.",
				// 	position: "top",
				// 	type:"info",
				// 	transition:"slide",
				// 	displayTime: 5
				// }
				copytoclipboard: {
					message: "Copied to clipboard.",
					type: "info",
					displayTime: 5
				},
				logdeactivated: {
					message: "Log scale has been deactivated due to a zero or negative value in your visible dataset.",
					type:"warning"
				},
				studynoteditable: {
					message: "This study is not editable",
					displayTime: 5
				},
				eldercannotadd: {
					message: "Elder Impulse study cannot be activated because a custom chart is already in use.",
					type: "info",
					displayTime: 3
				},
				gonogocannotadd: {
					message: "GoNoGo study cannot be activated because a custom chart is already in use.",
					type: "info",
					displayTime: 3
				},
				addAVWAP: {
					message: "Select AVWAP anchor time from the chart.",
					type: "info",
					displayTime: 0
				},
				removeAVWAP: {
					message: "Select AVWAP anchor time from the chart.",
					remove: true
				},
				changeperiodicity: {
					message: "Changing Periodicity may lose loaded data.",
				},
				duplicatesymbol: {
					message: "The comparison symbol cannot be the same as the main series.",
					displayTime: 4,
					type: "error"
				}
			},
			// Optionally set a market factory to the chart to make it market hours aware. Otherwise it will operate in 24x7 mode.
			// This is required for the simulator, or if you intend to also enable Extended hours trading zones.
			// Please note that, this method is set to use the CIQ.Market.Symbology functions by default,
			// which must be reviewed and adjust to comply with your quote feed and symbology format before they can be used.
			// Sample default setting requires resources loaded from
			// chartiq/examples/markets/marketDefinitionsSample and
			// chartiq/examples/markets/marketSymbologySample
			marketFactory: CIQ.Market.Symbology.factory,
			// All configuration parameters for chart engine except for container property
			// Only few are configured here. View available in https://documentation.chartiq.com/CIQ.ChartEngine.html
			// use in https://documentation.chartiq.com/CIQ.ChartEngine.html#.create
			chartEngineParams: {
				preferences: {
					labels: false,
					currentPriceLine: true,
					whitespace: 0
				}
			},
			// Array of objects containing properties to attach automated quote feeds
			// to the chart to handle initial load, pagination, and updates at preset intervals.
			// Property detail - {@link CIQ.ChartEngine#attachQuoteFeed}
			// @since 8.8.4 added backgroundRefreshInterval update periodicity when in multi-chart solo background
			quoteFeeds: [
				{
					quoteFeed: resources.quoteFeed,
					behavior: { refreshInterval: 1, backgroundRefreshInterval: 5, bufferSize: 200 },
					// filter: () => {}
				}
			],
			selector: {
				sideNav: ".ciq-sidenav",
				sidePanel: "cq-side-panel",
				lookupComponent: ".ciq-search cq-lookup",
				studyLegend: "cq-study-legend",
				timeSpanEvent: ".stx-markers cq-item.span-event",
				markersMenuItem: ".stx-markers cq-item",
				themesMenuItem: "cq-themes",
				tfcTradePanel: ".stx-trade-panel",
				tfcToggle: ".stx-trade",
			},
			themes: {
				builtInThemes: { "ciq-day": "Day", "ciq-night": "Night" },
				defaultTheme: "ciq-night",
				/**
				 * Optional override storage location of current theme and any custom defined themes. Takes a function with get, set, and remove methods
				 * If not defined, then the component will use CIQ.NameValueStore for storage.
				 */
				nameValueStore: resources.nameValueStore
			},
			// menu items
			menuPeriodicity: [
				{ type: "item", label: "1 D", cmd: "Layout.setPeriodicity(1,1,'day')", value: { period: 1, interval: 1, timeUnit: 'day'} },
				{ type: "item", label: "1 W", cmd: "Layout.setPeriodicity(1,1,'week')", value: { period: 1, interval: 1, timeUnit: 'week' } },
				{ type: "item", label: "1 Mo", cmd: "Layout.setPeriodicity(1,1,'month')", value: { period: 1, interval: 1, timeUnit: 'month' } },
				{ type: "separator", },
				{ type: "item", label: "1 Min", cmd: "Layout.setPeriodicity(1,1,'minute')", value: { period: 1, interval: 1, timeUnit: 'minute' } },
				{ type: "item", label: "5 Min", cmd: "Layout.setPeriodicity(1,5,'minute')", value: { period: 1, interval: 5, timeUnit: 'minute' } },
				{ type: "item", label: "10 Min", cmd: "Layout.setPeriodicity(1,10,'minute')", value: { period: 1, interval: 10, timeUnit: 'minute' } },
				{ type: "item", label: "15 Min", cmd: "Layout.setPeriodicity(3,5,'minute')", value: { period: 1, interval: 1, timeUnit: 'minute' } },
				{ type: "item", label: "30 Min", cmd: "Layout.setPeriodicity(1,30,'minute')", value: { period: 1, interval: 30, timeUnit: 'minute' } },
				{ type: "item", label: "1 Hour", cmd: "Layout.setPeriodicity(2,30,'minute')", value: { period: 2, interval: 30, timeUnit: 'minute' } },
				{ type: "item", label: "4 Hour", cmd: "Layout.setPeriodicity(8,30,'minute')", value: { period: 8, interval: 30, timeUnit: 'minute' } },
				{ type: "separator", },
				{ type: "item", label: "1 Sec", cmd: "Layout.setPeriodicity(1,1,'second')", value: { period: 1, interval: 1, timeUnit: 'second' } },
				{ type: "item", label: "10 Sec", cmd: "Layout.setPeriodicity(1,10,'second')", value: { period: 1, interval: 10, timeUnit: 'second' } },
				{ type: "item", label: "30 Sec", cmd: "Layout.setPeriodicity(1,30,'second')", value: { period: 1, interval: 30, timeUnit: 'second' } },
				{ type: "separator", },
				{ type: "item", label: "250 MSec", cmd: "Layout.setPeriodicity(1,250,'millisecond')", value: { period: 1, interval: 250, timeUnit: 'millisecond' } }
			],
			displayStyleIcons: true, // use style icons in the chart style menu
			menuChartStyle: [ // if displayStyleIcons is true and a suitable icon class for the iconCls parameter is not available, "generic" class can be applied
				{ type: "radio", label: "Candle", cmd: "Layout.ChartType()", iconCls: "candle", value: "candle"},
				{ type: "radio", label: "Bar", cmd: "Layout.ChartType()", iconCls: "bar", value: "bar", cls: "advanced-ui" },
				{ type: "radio", label: "Colored Bar", cmd: "Layout.ChartType()", iconCls: "colored-bar", value: "colored_bar", cls: "advanced-ui" },
				{ type: "radio", label: "Line", cmd: "Layout.ChartType()", iconCls: "line", value: "line" },
				{ type: "radio", label: "Vertex Line", cmd: "Layout.ChartType()", iconCls: "vertex-line", value: "vertex_line" },
				{ type: "radio", label: "Step", cmd: "Layout.ChartType()", iconCls: "step", value: "step" },
				{ type: "radio", label: "Mountain", cmd: "Layout.ChartType()", iconCls: "mountain", value: "mountain" },
				{ type: "radio", label: "Baseline", cmd: "Layout.ChartType()", iconCls: "baseline-delta", value: "baseline_delta", cls: "advanced-ui" },
				{ type: "radio", label: "Hollow Candle", cmd: "Layout.ChartType()", iconCls: "hollow-candle", value: "hollow_candle", cls: "advanced-ui" },
				{ type: "radio", label: "Volume Candle", cmd: "Layout.ChartType()", iconCls: "volume-candle", value: "volume_candle", cls: "advanced-ui" },
				{ type: "radio", label: "Colored HLC Bar", cmd: "Layout.ChartType()", iconCls: "colored-hlc", value: "colored_hlc", cls: "advanced-ui" },
				{ type: "radio", label: "Scatterplot", cmd: "Layout.ChartType()", iconCls: "scatterplot", value: "scatterplot", cls: "advanced-ui" },
				{ type: "radio", label: "Histogram", cmd: "Layout.ChartType()", iconCls: "histogram", value: "histogram" }
			],
			menuChartAggregates: [
				{ type: "separator", cls: "advanced-ui"},
				{ type: "radio", label: "Heikin Ashi", cmd: "Layout.ChartType()", iconCls: "heikinashi", value: "heikinashi", cls: "advanced-ui" },
				{ type: "radio", label: "Kagi", cmd: "Layout.ChartType()", options: "Layout.showAggregationEdit('kagi')", iconCls: "kagi", value: "kagi", cls: "advanced-ui" },
				{ type: "radio", label: "Line Break", cmd: "Layout.ChartType()", options: "Layout.showAggregationEdit('linebreak')", iconCls: "linebreak", value: "linebreak", cls: "advanced-ui" },
				{ type: "radio", label: "Renko", cmd: "Layout.ChartType()", options: "Layout.showAggregationEdit('renko')", iconCls: "renko", value: "renko", cls: "advanced-ui" },
				{ type: "radio", label: "Range Bars", cmd: "Layout.ChartType()", options: "Layout.showAggregationEdit('rangebars')", iconCls: "rangebars", value: "rangebars", cls: "advanced-ui" },
				{ type: "radio", label: "Point & Figure", cmd: "Layout.ChartType()", options: "Layout.showAggregationEdit('pandf')", iconCls: "pandf", value: "pandf", cls: "advanced-ui" },
			],
			menuChartPreferences: [
				{ type: "checkbox", label: "Range Selector", cmd: "Layout.RangeSlider()", cls: "rangeslider-ui" },
				{ type: "checkbox", label: "Extended Hours", cmd: "Layout.ExtendedHours()", cls: "extendedhours-ui" },
				{ type: "checkbox", label: "Animation", cmd: "Layout.Animation()", cls: "animation-ui" },
				{ type: "checkbox", label: "Hide Outliers", cmd: "Layout.Outliers()", cls: "outliers-ui" },
				{ type: "checkbox", label: "Market Depth", cmd: "Layout.MarketDepth()", cls: "marketdepth-ui" },
				{ type: "checkbox", label: "L2 Heat Map", cmd: "Layout.L2Heatmap()", cls: "marketdepth-ui" },
			],
			menuYAxisPreferences: [
				{ type: "checkbox", label: "Log Scale", cmd: "Layout.ChartScale('log')" },
				{ type: "checkbox", label: "Invert", cmd: "Layout.FlippedChart()" },
			],
			menuViewConfig: {
				// configure view menu options
			},
			menuStudiesConfig: { 	// All studies available are by default included in the studies menu
				excludedStudies: {
					"stochastics": true, // Remove simple stochastics, replaced with Stochastics
				},   // list of studies to exclude
				alwaysDisplayDialog: { ma: true },
	 			/*dialogBeforeAddingStudy: {"rsi": true} // here's how to always show a dialog before adding the study*/
			},
			menuAddOns: [
				{ type: "item", label: "Shortcuts / Hotkeys", cmd: "Layout.showShortcuts(true)", cls: "shortcuts-ui" },
				{ type: "item", label: "Import Data", cmd: "Channel.write('dataLoader', true)", cls: "dataLoader-ui"}
			],
			rangeMenu: [
				{ type: "range", label: "1D", cmd: "set(1,'today')" },
				{ type: "range", label: "5D", cmd: "set(5,'day',30,2,'minute')" },
				{ type: "range", label: "1M", cmd: "set(1,'month',30,8,'minute')" },
				{ type: "range", label: "3M", cmd: "set(3,'month')", cls: "hide-sm" },
				{ type: "range", label: "6M", cmd: "set(6,'month')", cls: "hide-sm" },
				{ type: "range", label: "YTD", cmd: "set(1,'YTD')", cls: "hide-sm" },
				{ type: "range", label: "1Y", cmd: "set(1,'year')" },
				{ type: "range", label: "5Y", cmd: "set(5,'year',1,1,'week')", cls: "hide-sm" },
				{ type: "range", label: "All", cmd: "set(1,'all')", cls: "hide-sm" },
			],
			drawingTools: [
				{ type: "dt", tool: "annotation", group: "text", label: "Annotation", shortcut: "w" },
				{ type: "dt", tool: "arrow", group: "markings", label: "Arrow", shortcut: "a" },
				{ type: "dt", tool: "line", group: "lines", label: "Line", shortcut: "l" },
				{ type: "dt", tool: "horizontal", group: "lines", label: "Horizontal", shortcut: "o" },
				{ type: "dt", tool: "vertical", group: "lines", label: "Vertical", shortcut: "p" },
				{ type: "dt", tool: "rectangle", group: "markings", label: "Rectangle", shortcut: "r" },
				{ type: "dt", tool: "trendline", group: "lines", label: "Trend Line", shortcut: "t" },
				{ type: "dt", tool: "measurementline", group: "statistics", label: "Measurement Line", shortcut: "" },
				{ type: "dt", tool: "average", group: "statistics", label: "Average Line" },
				{ type: "dt", tool: "callout", group: "text", label: "Callout" },
				{ type: "dt", tool: "channel", group: "lines", label: "Channel" },
				{ type: "dt", tool: "check", group: "markings", label: "Check" },
				{ type: "dt", tool: "continuous", group: "lines", label: "Continuous" },
				{ type: "dt", tool: "crossline", group: "lines", label: "Crossline" },
				{ type: "dt", tool: "elliottwave", group: "technicals", label: "Elliott Wave"},
				{ type: "dt", tool: "ellipse", group: "markings", label: "Ellipse", shortcut: "e" },
				{ type: "dt", tool: "freeform", group: "lines", label: "Doodle" },
				{ type: "dt", tool: "fibprojection", group: "fibonacci", label: "Fib Projection" },
				{ type: "dt", tool: "fibarc", group: "fibonacci", label: "Fib Arc" },
				{ type: "dt", tool: "fibfan", group: "fibonacci", label: "Fib Fan" },
				{ type: "dt", tool: "fibtimezone", group: "fibonacci", label: "Fib Time Zone" },
				{ type: "dt", tool: "focusarrow", group: "markings", label: "Focus" },
				{ type: "dt", tool: "gannfan", group: "technicals", label: "Gann Fan" },
				{ type: "dt", tool: "gartley", group: "technicals", label: "Gartley" },
				{ type: "dt", tool: "heart", group: "markings", label: "Heart" },
				{ type: "dt", tool: "pitchfork", group: "technicals", label: "Pitchfork" },
				{ type: "dt", tool: "quadrant", group: "statistics", label: "Quadrant Lines" },
				{ type: "dt", tool: "ray", group: "lines", label: "Ray" },
				{ type: "dt", tool: "regression", group: "statistics", label: "Regression Line" },
				{ type: "dt", tool: "retracement", group: "fibonacci", label: "Fib Retracement" },
				{ type: "dt", tool: "star", group: "markings", label: "Star" },
				{ type: "dt", tool: "speedarc", group: "technicals", label: "Speed Resistance Arc" },
				{ type: "dt", tool: "speedline", group: "technicals", label: "Speed Resistance Line" },
				{ type: "dt", tool: "timecycle", group: "technicals", label: "Time Cycle" },
				{ type: "dt", tool: "tirone", group: "statistics", label: "Tirone Levels" },
				{ type: "dt", tool: "volumeprofile", group: "statistics", label: "Volume Profile" },
				{ type: "dt", tool: "xcross", group: "markings", label: "Cross" },
			],
			drawingToolGrouping: [
				"All",
				"Favorites",
				"Fibonacci",
				"Lines",
				"Markings",
				"Statistics",
				"Technicals",
				"Text"
			],
			menuRendering: {
				separator: () => `
					<cq-separator></cq-separator>`,
				item: ({ label, cmd, cls }) => `
					<cq-item ${cls ? `class="${cls}"` : "" } stxtap="${cmd}">${label}</cq-item>`,
				radio: ({ label, cmd, options, cls, iconCls, value }, { displayStyleIcons }) => `
					<cq-item class="${cls || ''}${iconCls && displayStyleIcons ? ' ciq-menu-icon' : ''}"
						stxsetget="${cmd}"
						${value ? ` data-value=${JSON.stringify(value)}` : ""}>
						${iconCls && displayStyleIcons ? `<span ciq-menu-icon class="${'ciq-icon-' + iconCls}"></span>` : "" }
						${options ? `<span class="ciq-edit" stxtap="${options}" keyboard-selectable-child="true"></span>` : "" }
						<div><span ciq-label>${label}</span><span class="ciq-radio"><span></span></span></div>
					</cq-item>`,
				radioOptions: (...args) => { // alias for deprecated radioOption
					return config.menuRendering.radio.apply(config, args);
				},
				checkbox: ({ label, cmd, cls }) => `
					<cq-item
						${cls ? `class="${cls}"` : ""}
						stxsetget="${cmd}">${label}<span class="ciq-switch ciq-active"><span></span></span>
					</cq-item>`,
				checkboxOptions: ({ label, cmd, options, cls }) => `
					<cq-item ${cls ? `class="${cls}"` : ""}>
						<span class="ciq-edit" stxtap="${options}"></span>
						<div stxsetget="${cmd}">${label}<span class="ciq-switch ciq-active"><span></span></span></div>
					</cq-item>`,
				doubleslider: ({ label, cmd, attrs, cls }) => `
					<cq-item
						${cls ? `class="${cls}"` : ""}
						>${label}<span><cq-double-slider ${attrs}></cq-double-slider><span></span></span>
					</cq-item>`,
				range: ({ label, cmd, cls }) => `
					<div ${cls ? `class="${cls}"` : ""} stxtap="${cmd}">${label}</div>
				`,
				dt: ({ tool, group, label, shortcut }) => `<cq-item
						class="ciq-tool"
						cq-tool="${tool}"
						${shortcut ? `cq-tool-shortcut="${shortcut}"` : ""}
						cq-tool-group="${group}"
						stxtap="tool('${tool}')"
					>
						<span class="icon ${tool}"></span>
						<label>${label}</label>
						<cq-help help-id="drawing_palette_${tool}"></cq-help>
					</cq-item>
				`
			},
			getMenu(name, sort) {
				let menu = this[name];
				if (!menu) return;
				if (sort === true) sort = (a, b) => (a.label > b.label ? 1 : -1);
				if (typeof sort === "function") menu.sort(sort);
				return this[name].map((options) => this.menuRendering[options.type || "item"](options, this));
			},
			addOns: {
				// Floating tooltip on mousehover
				tooltip: {
					ohl:true,
					volume:true,
					series:true,
					studies:true
				},
				// Inactivity timer
				inactivityTimer: { minutes: 30 },
				
				// Animation
				animation: { animationParameters: { tension: 0.3 } },
				// Outliers
				outliers: {},

				// Range Slider
				rangeSlider: {},
				// Enables Full Screen mode toggle button in chart controls
				fullScreen: {},
				// Extended hours trading zones
				extendedHours: { filter: true },
				// Continuous Zoom will also enable the SmartZoom button in your chart zoom controls
				// which allows the end-user to toggle the feature on and off.
				continuousZoom: {
					periodicities: [
						// daily interval data
						{period: 1,   interval: "month"},
						{period: 1,   interval: "week"},
						{period: 1,   interval: "day"},
						// 30 minute interval data
						{period: 8,   interval: 30},
						{period: 1,   interval: 30},
						// 1 minute interval data
						{period: 5,   interval: 1},
						{period: 1,   interval: 1},
						// one second interval data
						{period: 10,  interval: 1, timeUnit:"second"},
						{period: 1,   interval: 1, timeUnit:"second"},
					],
					boundaries: {
						maxCandleWidth: 15,
						minCandleWidth: 3
					}
				},
				// Forecasting
				forecasting: {
					moduleName: "PlotComplementer",
					id: "forecast",
					decorator: { symbol: "_fcst", display: " Forecast" },
					renderingParameters: { chartType: "channel", opacity: 0.5, pattern: "dotted" },
					quoteFeed: resources.forecastQuoteFeed,
					behavior: { refreshInterval:60 }
				},
				// TableView
				tableView: {},
				// DataLoader
				dataLoader: {},
				// Shortcuts
				shortcuts: {}
			},
			plugins: {
				ptv: {
					moduleName: "TimeSpanEventPanel",
					menuItemSelector: ".stx-markers cq-item.span-event",
					loadSample: true,
					showTooltip: true,
					// Event info can be displayed in "main" chart or in TSE "panel"
					infoPanel: {
						durationEvent: 'main',
						spanEvent: 'main',
						singleEvent: 'main'
					}
				},
				// Enable the Active Trader Market Depth panel
				marketDepth: {
					volume: true,
					mountain: true,
					step: true,
					record: true,
					height: "50%",
					orderbook: true,
					interaction: true
				},
				// Trade From Chart (TFC)
				// set account key to your custom account class, or leave as undefined to default to CIQ.Account.Demo constructor
				// import plugins/tfc/tfc-demo.js or set loadSample=true to make CIQ.Account.Demo available for sample account creation
				tfc: {
					moduleName: "TFC",
					container: ".ciq-menu-section .ciq-toggles",
					loadSample: true,
					// account: undefined,  // Account instance object or a constructor
					/**
					 * By default if a constructor is provided in account the first created instance is shared with all TFC instances
					 * set following to true to create unique instances
					 */
					// allowUniqueAccountConstruction: true
					startCompact: true // opens plugin in compact mode
				},
				crossSection: {
					pointFreshnessTimeout: 1, // pointFreshnessTimeout 1 min for demo purposes
					enableTimeSeries: true, // toggles on time-series related options
					xAxisType: "regular", // plots ticks across the xaxis in even intervals (if sortFunction not customized)
					timelineDateSelector: {
						height: 95,
						useNotifications: true
					},
					postInstall({ uiContext, extension }) {
						const { stx: { crossSection } } = uiContext;
						CIQ.getFn("UI.CurveEdit")(null, uiContext, this);
						CIQ.getFn("CrossSection.HUD")(null, uiContext);
						if (this.timelineDateSelector) {
							CIQ.getFn("CrossSection.TimelineDateSelector")(
								Object.assign({ crossSection }, this.timelineDateSelector)
							);
						}
						// Connect datepicker change to crosssection callback
						const datepicker = uiContext.topNode.querySelector("cq-datepicker");
						if (datepicker) {
							datepicker.registerCallback(date => extension.setCurveDate(date));
						}
					}
				},
				visualEarnings: {
					container: ".ciq-menu-section .ciq-dropdowns"
				},
				signalIQ: {
					panelHeight: 150,
					displayCondition: false,
					emojiPicker: resources.emojiPicker && {
						// create a picker instance and open it
						open({ stx, targetElement, handler }) {
							if (!this.pickers) this.pickers = new Map();
							if (!this.pickers.has(targetElement)) {
								const button = this.container = document.createElement("button");
								button.type = "button";
								button.classList.add("marker-emoji-picker");
								targetElement.parentElement.insertBefore(button, targetElement.nextSibling);
								const emojiList = [];
								this.emojis.forEach((label) => {
									emojiList.push({ value: stx.emojify(`:${label.replace(/\|/g, "::")}:`), label });
								});
								this.pickers.set(targetElement, new resources.emojiPicker({
									button,
									targetElement,
									container: this.container,
									emojiList,
									displacements: { x:0 }
								}));
							}
							const picker = this.pickers.get(targetElement);
							picker.onSelect(handler);
							picker.toggle(true);
						},
						// remove unused resources
						clean() {
							if (this.pickers) {
								this.pickers.forEach((picker) => picker.toggle(false));
								this.pickers = null;
							}
						},
						// Array of emojis.  Use a pipe to designate a skin tone; e.g. "point_up|skin-tone-4"
						emojis: [
							"smile", "partying_face", "sob", "money_mouth_face", "arrow_upper_right", "arrow_lower_right", "ox", "bear",
							"gem", "rocket", "heart", "poop", "fire", "bomb", "pray", "moneybag"
						]
					},
					// Include more as we find those not conducive to alerting
					disallowedStudies: ["Darvas", "Elder Impulse", "GoNoGo Trend", "Pivot Points",
						"Sentiment By Strike", "val lines", "Volatility Cone", "vol profile"],
				},
				scriptIQ: {},
				analystViews: {
					container: ".ciq-menu-section .ciq-toggles",
					moduleName: "TCAnalystViews",
					partner: 1000,
					token: "eZOrIVNU3KR1f0cf6PTUYg=="
				},

				technicalInsights: {
					container: ".ciq-menu-section .ciq-toggles",
					moduleName: "TCTechnicalInsights",
					lang: "en",
					uid: ""
				}
			},
			// path of component communication channels
			// layout properties are persisted between reloads
			channels: {
				lookup: "channel.lookup",
				crosshair: "layout.crosshair",
				headsUp: "layout.headsUp",
				sidenav: "layout.sidenav",
				tableView: "channel.tableView",
				drawing: "channel.drawing",
				drawingPalettes: "channel.drawingPalettes",
				breakpoint: "channel.breakpoint",
				containerSize: "channel.containerSize",
				sidenavSize: "channel.sidenavSize",
				sidepanelSize: "channel.sidepanelSize",
				pluginPanelHeight: "channel.pluginPanelHeight",
				tfc: "channel.tfc",
				analystviews: "channel.analystviews",
				technicalinsights: "channel.technicalinsights",
				dataLoader: "channel.dataLoader",
				dialog: "channel.dialog",
				keyboardNavigation: "channel.keyboardNavigation",
				class: "channel.componentClass"
			},
			// dialogs
			dialogs: {
				dataLoader: { tag: "cq-data-dialog" },
				view: { tag: "cq-view-dialog" },
				aggregation: { tag: "cq-aggregation-dialog" },
				timezone: { tag: "cq-timezone-dialog" },
				language: { tag: "cq-language-dialog" },
				lookup: { tag: "cq-lookup-dialog" },
				theme: { tag: "cq-theme-dialog" },
				study: {
					tag: "cq-study-dialog",
					attributes: {
						"cq-study-axis": true,
						"cq-study-panel": "alias"
					}
				},
				signaliq: { tag: "cq-signaliq-dialog" },
				fibSettings: { tag: "cq-fib-settings-dialog" },
				volumeprofileSettings: { tag: "cq-volumeprofile-settings-dialog" },
				measurementlineSettings: { tag: "cq-measurementline-settings-dialog" },
				share: { tag: "cq-share-dialog" }
			},
			// Event Markers implementation
			eventMarkersImplementation: resources.markerFeed,
			// Scrollbar styling implementation for cq-scroll component
			scrollbarStyling: {
				refresh(component, options = { suppressScrollX: true }) {
					if (typeof resources.scrollStyle !== "function") return;
					if (!component.__ps) {
						component.__ps = new resources.scrollStyle(component, options);
						component.__ps.scrollbarX.setAttribute('tabindex', -1);
						component.__ps.scrollbarY.setAttribute('tabindex', -1);
					}
					component.__ps.update(component);
				},
				destroy(component) {
					if (component.__ps) component.__ps.destroy();
				}
			},
			// Copy symbol from the reference chart when a new chart is added
			// true value copies active chart symbol, false use initialSymbol, null leaves chart without symbol
			multiChartCopySymbol: null,
			// Message to display when chart is created without symbol
			multiChartLoadMsg: "Click to load a symbol",
			// On multi chart grid expansion restores charts that have been temporarily placed off grid due to grid size reduction.
			// The sequence of charts, left to right, rather than specific grid positions is restored.
			restoreOffgridCharts: true, 
			// Class to access and store data about the chart eg preferences, chart layout, and drawings for chart.
			// If you were using this property previously it stored information for themes which has now been moved to config.themes.nameValueStore
			nameValueStore: resources.nameValueStore,
			// Optional function to call when web components have initialized
			onWebComponentsReady: () => {},
			// Callback to execute prior layout import or instrument loading after addOns and plugins have been initialized.
			// To set instrument for initial load, use this configuration's initialSymbol property and set the restore property to false or restore.symbol to false
			onEngineReady: (stx) => {},
			// Callback to execute when chart is loaded for first time
			onChartReady: (stx) => {},
			// Callback to execute on multi chart events
			// type "chartDestroy" and "chartReady" have the CIQ.ChartEngine "stx" property in the details object
			// type "contextSwitch" has "prev" and "context" context objects in the details parameter
			// @since 8.9.0
			onMultiChartEvent: (type, details) => {},
			// In multichart setting expand active chart by hiding all others for following settings
			soloActive: {
				onDraw: { // onDraw is no longer invoked
					shouldSolo(stx) { // should active chart solo when drawing is enabled for chart with stx parameter
						// Uncomment following if above medium breakpoint in chart solo on drawing is required
						// const { width, height } = stx.container.getBoundingClientRect();
						// return width < 584 || height < 350;
						return false;
					},
					// notification message
					notify: {
						message: "Click on the draw toggle again to close drawing tools and return to grid view",
					}
				},
				onTFC: {
					shouldSolo(stx) {
						const { width, height } = stx.container.getBoundingClientRect();
						return width < 300 || height < 250;
					},
					notify: {
						message: "Chart has been maximized to make it easier to set trade prices.",
					}
				}
			},
			// Setting to load initial symbol from a URL.
			//
			// If symbolParam defined query string parameter is provided in URL then this configs:
			// - `initialSymbol` property will be updated based on query string
			// - `restore` property will be updated to `restore.symbol = false`
			// Adjust or delete from config if this default behavior is not desired
			useQueryString: {
				symbolObject: {
					symbol: "symbol",
					name: "name",
					exchDisp: "exchDisp"
				},
			},
			updateFromQueryString() {
				if (!this.useQueryString) return;
				const queryObj = CIQ.qs();
				const symbolObject = Object.entries(this.useQueryString.symbolObject)
					.reduce((acc, [key, val]) => {
						const value = queryObj[val];
						if (value !== undefined) acc[key] = value;
						return acc;
					}, {});
				if (symbolObject.symbol) {
					this.initialSymbol = symbolObject;
					if (this.restore) { // do not restore symbol use one set in initialSymbol
						this.restore = { ...this.restore, symbol: false };
					}
				}
			},
			// The list of chart elements that should be exposed to the screen reader instead of hidden by default.
			ariaActive: [
				"cq-chart-instructions",
				"cq-toggle.tableview-ui",
				"cq-lookup",
				".symbol-search",
				".ciq-data-table-container",
				".hu-tooltip"
			],
			// Function to create a new chart; returns a CIQ.ChartEngine instance
			createChart: function(container) {
				this.updateFromQueryString();
				const config = this;
				if(CIQ.UI) return (new CIQ.UI.Chart()).createChartAndUI({ container, config }).stx;
				return CIQ.ChartEngine.create({ container, config });
			}
		};
		if(!resources.quoteFeed) config.quoteFeeds.length=0;
		return config;
	}
export default getConfig;

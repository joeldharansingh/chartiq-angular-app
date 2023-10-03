//
// Sample trade analytics with markers
// This file contains functions which create a sample implementation of post trade analysis using markers.  This file is meant to be used in conjunction with the markersSample.js file by extending the functionality of MarkersSample. There is a stylesheet which goes along with it as well.
// Usage: new MarkersSample(stxx);
//
import { CIQ, markers } from "../../js/standard.js";
import marker from "../../examples/markers/markersSample.js";
const cssReady = new Promise((resolve) => {
	if (import.meta.webpack) {
		// webpack 5
		import(
			/* webpackMode: "eager" */ "../../examples/markers/tradeAnalyticsSample.css"
		).then(resolve);
	} else if (
		typeof define === "undefined" &&
		typeof module === "object" &&
		typeof require === "function"
	) {
		// webpack 4
		resolve(require("../../examples/markers/tradeAnalyticsSample.css"));
	} else if (typeof define === "function" && define.amd) {
		define(["../../examples/markers/tradeAnalyticsSample.css"], resolve);
	} else if (typeof window !== "undefined") {
		// no webpack
		CIQ.loadStylesheet(
			new URL(
				"../../examples/markers/tradeAnalyticsSample.css",
				import.meta.url
			).href,
			resolve
		);
	} else resolve();
}).then((m) => CIQ.addInternalStylesheet(m, "tradeAnalyticsSample")); // a framework, such as Angular, may require style addition
CIQ.activateImports(markers);
const MarkersSample = marker.MarkersSample;
MarkersSample.registerType("trade", "showTradeAnalytics");
MarkersSample.prototype.showTradeAnalytics = function () {
	if (!CIQ.Marker.Performance) {
		return console.error(
			"tradeAnalyticsSample feature requires first activating highPerformanceMarkers feature."
		);
	}
	let { stx } = this;
	let { chart } = stx;
	let { dataSet, dataSegment } = chart;
	if (!(dataSet.length && dataSegment.length)) return;
	if (!dataSegment[10]) return;
	CIQ.Marker({
		stx: stx,
		label: "trade",
		xPositioner: "date",
		x: dataSegment[10].DT,
		node: new CIQ.Marker.Simple({
			type: "callout",
			headline: "Begin Trade Period",
			category: "analysis",
			story:
				"Starting Price: " +
				dataSegment[10].Close +
				"\n\
			Shares: 5000\n\
						Exchange: " +
				chart.market.market_def.name
		})
	});
	let endTick = stx.tickFromDate(chart.endPoints.end, chart);
	if (endTick && dataSet[endTick - 2] && dataSet[endTick - 2].DT) {
		CIQ.Marker({
			stx: stx,
			label: "trade",
			xPositioner: "date",
			x: dataSet[endTick - 2].DT,
			node: new CIQ.Marker.Simple({
				type: "callout",
				headline: "End Trade Period",
				category: "analysis",
				story:
					"Ending Price: " +
					dataSegment[dataSegment.length - 2].Close +
					"\n\
				Shares: 5000\n\
						Exchange: " +
					chart.market.market_def.name
			})
		});
	}
	this.createTradeMarkers(stx);
	return ["callout", "trade"];
};
MarkersSample.prototype.createTradeMarkers = function () {
	const dataSegment = this.stx.chart.dataSegment;
	const story =
		"Like all ChartIQ markers, the object itself is managed by the chart, so when you scroll the chart the object moves with you. It is also destroyed automatically for you when the symbol is changed.";
	for (let i = dataSegment.length - 3; i > 10; i = i - 2) {
		let qt = dataSegment[i];
		CIQ.Marker({
			stx: this.stx,
			label: "trade",
			xPositioner: "date",
			x: qt.DT,
			node: new CIQ.Marker.Performance({
				type: "circle",
				category: "trade",
				displayCategory: false,
				// displayStem: false,
				headline: "Executed at $" + qt.Close,
				story: story
			})
		});
	}
};
export default marker;

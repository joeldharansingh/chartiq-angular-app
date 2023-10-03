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


import { CIQ } from "../../js/components.js";
import "./studyfavorites.js";

const cssReady = new Promise((resolve) => {
	if (import.meta.webpack) {
		// webpack 5
		import(/* webpackMode: "eager" */ "./studybrowser.css").then(resolve);
	} else if (
		typeof define === "undefined" &&
		typeof module === "object" &&
		typeof require === "function"
	) {
		// webpack 4
		resolve(require("./studybrowser.css"));
	} else if (typeof define === "function" && define.amd) {
		define(["./studybrowser.css"], resolve);
	} else if (typeof window !== "undefined") {
		// no webpack
		CIQ.loadStylesheet(
			new URL("./studybrowser.css", import.meta.url).href,
			resolve
		);
	} else resolve();
}).then((m) => CIQ.addInternalStylesheet(m, "studybrowser")); // a framework, such as Angular, may require style addition

/**
 * StudyBrowser web component `<cq-study-browser>`.
 *
 * @namespace WebComponents.cq-study-browser
 *
 * @since 8.8.0
 */
class StudyBrowser extends CIQ.UI.ContextTag {
	constructor() {
		super();
		this.interactiveStudies = {
			"Anchored VWAP": true
		};
	}

	adoptedCallback() {
		super.adoptedCallback();
		CIQ.UI.flattenInheritance(this, StudyBrowser);
		this.constructor = StudyBrowser;
	}

	setContext() {
		if (this.init) return;
		this.addDefaultMarkup();

		this.getStudies();
		this.setupInfoPanel();
		this.filterCategory("Study Library");

		// decorate the containing menu show to detect open action
		const parentMenu = this.closest("cq-menu");
		if (parentMenu && parentMenu.show) {
			const { show } = parentMenu;
			parentMenu.show = (...args) => {
				show.apply(parentMenu, args);
				this.open();
			};
		}

		if (parentMenu && parentMenu.hide) {
			const { hide } = parentMenu;
			parentMenu.hide = (...args) => {
				hide.apply(parentMenu, args);
				this.hide();
			};
		}

		this.responsiveSetup();
		this.init = true;
	}

	changeContext(newContext) {
		this.context = newContext;

		if (!this.innerHTML) {
			setTimeout(() => {
				this.changeContext(newContext);
			});
			return;
		}

		this.querySelector("cq-study-legend").context = newContext;
		this.querySelector("cq-studies").context = newContext;
		this.setupActiveStudyCountListener();
	}

	open() {
		this.filterCategory(this.currentFilter);
		this.context.topNode.classList.add("ciq-sb-active");
	}

	hide() {
		this.context.topNode.classList.remove("ciq-sb-active");
	}

	getStudies() {
		const { stx } = this.context;

		this.categories = CIQ.Studies.Categories;
		const categoryContainer = this.querySelector(
			".ciq-sb-categories cq-scroll"
		);
		const subCategories = Object.keys(this.categories);
		if (CIQ.Scripting) {
			subCategories.push("ScriptIQ");
		}

		categoryContainer.insertAdjacentHTML(
			"beforeend",
			`<cq-separator></cq-separator>
					<cq-heading>Categories</cq-heading>`
		);

		subCategories
			.sort()
			.filter((cat) => cat !== "Popular")
			.forEach((cat) => {
				categoryContainer.insertAdjacentHTML(
					"beforeend",
					`<cq-item cq-no-close cq-filter="${cat}">${cat}</cq-item>`
				);
			});

		this.makeTap(this.querySelector(".ciq-sb-categories"), (e) => {
			const { target } = e;
			const filter = target.getAttribute("cq-filter");
			if (filter) {
				this.filterCategory(filter);
				e.stopPropagation();
			}
		});

		const favoriteContainer = this.querySelector("div[ciq-favorite-studies]");
		CIQ.safeClickTouch(
			favoriteContainer,
			(e) => {
				const { target } = e;
				const isFavorite = target.classList.contains("fav-marker");
				const el = target.closest("cq-item");
				if (!el) return;
				const name = el.getAttribute("ciq-name");

				if (!isFavorite && this.interactiveStudies[name]) {
					CIQ.UI.getUIManager(this).closeTopMenu();
				}
				if (isFavorite) {
					CIQ.Studies.Favorites.remove(name);
					this.updateFavoriteList();
				} else {
					const { type, inputs, outputs, parameters } =
						CIQ.Studies.Favorites.getList().find(
							({ name: sName }) => sName === name
						);
					CIQ.Studies.addStudy(
						this.context.stx,
						type,
						inputs
							? { ...inputs, display: undefined, id: undefined }
							: undefined,
						outputs,
						parameters
					);
				}
			},
			{ absorbDownEvent: false }
		);

		this.studyCountEl = this.querySelector(".ciq-active-study-count");
		this.setupActiveStudyCountListener();

		CIQ.Studies.Favorites.retrieveList(stx, (list) => {});
	}

	setupActiveStudyCountListener() {
		if (!this.layoutListener) {
			this.layoutListener = (stx) => {
				if (!this.studyCountEl) return;
				this.studyCountEl.innerText = Object.values(
					stx.layout.studies || {}
				).filter(({ signalData }) => !signalData).length;
			};
		}

		if (this.layoutListenerSetup) {
			const { stx, listener } = this.layoutListenerSetup;
			stx.removeEventListener(listener);
		}

		const { stx } = this.context;
		const listener = stx.addEventListener("layout", this.layoutListener);
		this.layoutListener(stx);
		this.layoutListenerSetup = {
			stx,
			listener
		};
	}

	filterCategory(filterName) {
		this.hideStudyInfo();
		this.currentFilter = filterName;
		const studies = this.categories[filterName];
		const allStudies = filterName === "Study Library";
		const filters = this.querySelectorAll(".ciq-sb-categories cq-item");
		filters.forEach((item) => {
			item[
				item.getAttribute("cq-filter") === filterName
					? "setAttribute"
					: "removeAttribute"
			]("cq-active-category", "");
		});

		if (studies || allStudies) {
			this.querySelectorAll("cq-studies cq-item span").forEach((study) => {
				const name =
					study.getAttribute("cq-translate-original") || study.textContent;
				study.parentElement.style.display =
					allStudies || studies.includes(name) ? "" : "none";
			});
			const filter = this.querySelector("cq-heading input");
			if (!allStudies) {
				filter.value = "";
				filter.dispatchEvent(new Event("input"));
			}
			this.querySelector("cq-heading[cq-filter]").style.display = allStudies
				? ""
				: "none";
			this.selectType("all");
			this.querySelector("cq-studies").updateOrder();
		} else if (filterName === "Active Studies") {
			this.selectType("active");
		} else if (filterName === "ScriptIQ") {
			this.selectType("scriptiq");
		} else {
			this.selectType("favorites");
			this.updateFavoriteList();
		}
	}

	selectType(type) {
		if (type === undefined) type = this.getAttribute("ciq-study-type") || "all";
		const types = this.querySelector(".ciq-sb-studies").children;
		["all", "active", "favorites", "scriptiq"].forEach((name, i) => {
			const selected = type === name;
			types[i].style.display = selected ? "" : "none";
			if (selected && types[i].querySelector("cq-scroll").refresh) {
				types[i].querySelector("cq-scroll").refresh();
			}
		});
		this.setAttribute("ciq-study-type", type);
	}

	updateFavoriteList() {
		const { stx } = this.context;
		const container = this.querySelector("div[ciq-favorite-studies]");
		const sortFn = function ({ name: a }, { name: b }) {
			// return a.localeCompare(b);
			if (a < b) return -1;
			if (a > b) return 1;
			return 0;
		};
		CIQ.Studies.Favorites.retrieveList(this.context.stx, (favoriteList) => {
			const items = [...favoriteList].sort(sortFn).map((item) => {
				const { studyName, name } = item;
				const translatedName =
					(studyName &&
						name.replace(/[^(]*/, stx.translateIf(studyName) + " ")) ||
					stx.translateIf(name);
				return `
					<cq-item class="ciq-favorite" ciq-name="${item.name}"
						><div class="fav-marker"></div><cq-label>${translatedName}</cq-label></cq-item>`;
			});
			container.innerHTML = items.join("\n");
		});
	}

	setupInfoPanel() {
		const studiesContainer = this.querySelector("cq-studies");
		studiesContainer.showStudyInfo = this.showStudyInfo.bind(this);

		this.makeTap(this.querySelector(".ciq-info-panel"), (e) => {
			const addingStudy = e.target.matches(".ciq-btn");
			if (!(addingStudy && this.interactiveStudies[this.infoPanelStudy.name])) {
				e.stopPropagation();
			}
		});

		this.makeTap(this.querySelector(".ciq-info-panel-back-btn"), (e) => {
			this.hideStudyInfo();
		});

		this.makeTap(this.querySelector(".ciq-info-panel .fav-marker"), (e) => {
			const el = e.target;
			el.classList.toggle("ciq-favorite");
			if (el.classList.contains("ciq-favorite")) {
				CIQ.Studies.Favorites.add(this.infoPanelStudy.name);
			} else {
				CIQ.Studies.Favorites.remove(this.infoPanelStudy.name);
			}
			this.updateFavoriteList();
			this.querySelector("cq-studies").updateOrder();
		});

		this.makeTap(
			this.querySelector(".ciq-info-panel-controls .ciq-btn"),
			(e) => {
				this.addStudy(this.infoPanelStudy.type);
				this.hideStudyInfo();
			}
		);
	}

	showStudyInfo(studyType) {
		const panel = this.querySelector(".ciq-info-panel");
		panel.classList[studyType ? "add" : "remove"]("ciq-info-panel-active");

		if (!studyType) return;

		const [, { name: studyName }] =
			Object.entries(CIQ.Studies.studyLibrary).find(([key, { name }]) => {
				return key === studyType;
			}) || [];
		this.infoPanelStudy = { type: studyType, name: studyName };

		const isFavorite = CIQ.Studies.Favorites.includes(studyName);
		const { description, link } = (CIQ.Studies.Info || {})[studyName] || {};

		const titleEl = this.querySelector(".ciq-info-panel-title");
		const favEl = this.querySelector(".ciq-info-panel .fav-marker");
		const descriptionEl = this.querySelector(".ciq-info-panel-description");
		const linkEl = this.querySelector(".ciq-info-panel a");

		titleEl.textContent = studyName;
		favEl.classList.toggle("ciq-favorite", !!isFavorite);
		descriptionEl.innerHTML =
			"<p>" + (description || "").replace(/\n|\r/g, "</p><p>") + "</p>";
		linkEl.style.display = link ? "" : "none";
		linkEl.href = link;
	}

	hideStudyInfo() {
		this.showStudyInfo(false);
	}

	addStudy(type) {
		const { stx } = this.context;

		CIQ.Studies.addStudy(stx, type);
	}

	responsiveSetup() {
		const {
			config: { channels },
			stx
		} = this.context;
		const contextEl = this.closest("cq-context");
		if (contextEl.querySelector(".ciq-multi-chart-container-wrapper")) {
			const studiesDropdown = contextEl.querySelector(
				".ciq-studies cq-menu-dropdown"
			);

			this.multiChartContainer = contextEl;

			CIQ.UI.addResizeListener(contextEl, () => {
				Object.assign(
					studiesDropdown.style,
					contextEl.clientWidth < 600
						? { right: "-88px", width: contextEl.clientWidth + "px" }
						: { right: 0, width: "" }
				);
			});

			return;
		}
		const chartAreaEl = contextEl.querySelector(
			".ciq-multi-chart-container-wrapper, .ciq-chart-area"
		);
		const dropDownEl = contextEl.querySelector(
			".ciq-menu.ciq-studies cq-menu-dropdown"
		);

		const relocateStudyBrowser = (size) => {
			if (!/break-sm|break-md|break-lg/.test(size)) return;
			const containerEl = size === "break-sm" ? chartAreaEl : dropDownEl;
			if (!containerEl.contains(this)) {
				const all = this.querySelectorAll("*");
				all.forEach((el) => {
					if (el.disconnectedCallback) el.doNotDisconnect = true;
				});
				containerEl.append(this);
				all.forEach((el) => {
					if (el.doNotDisconnect) delete el.doNotDisconnect;
				});
			}
		};

		CIQ.UI.BaseComponent.prototype.channelSubscribe(
			channels.breakpoint,
			relocateStudyBrowser,
			stx
		);
	}

	disconnectedCallback() {
		if (this.multiChartContainer) {
			CIQ.UI.removeResizeListener(this.multiChartContainer);
		}
		super.disconnectedCallback();
	}
}

StudyBrowser.markup = `
		<div class="ciq-sb-container">
			<div class="ciq-sb-categories">
				<cq-scroll cq-max-height="500">
					<cq-heading>Studies</cq-heading>
					<cq-item cq-no-close cq-filter="Active Studies">
						<div class="ciq-active-studies"></div>
						Active Studies
						<div class="ciq-active-study-count">0</div>
					</cq-item>
					<cq-item cq-no-close class="ciq-favorite" cq-filter="Favorites">
						<div class="ciq-favorite-studies"></div>
						Favorites
					</cq-item>
					<cq-item cq-no-close cq-filter="Popular">
						<div class="ciq-popular-studies"></div>
						Most Popular
					</cq-item>
					<cq-item cq-no-close cq-filter="Study Library">
						<div class="ciq-study-library"></div>
						Study Library
					</cq-item>
				</cq-scroll>
			</div>
			<div class="ciq-sb-studies">
				<div ciq-sb-panel-all>
					<cq-heading cq-search-icon cq-filter="Search Studies" cq-filter-min="15"></cq-heading>
					<cq-scroll cq-max-height="450">
						<cq-studies ciq-favorites>
						<template>
							<cq-item><div class="fav-marker"></div><span></span><div class="ciq-info-btn"></div></cq-item>
						</template>
						<cq-studies-content></cq-studies-content>
						</cq-studies>
					</cq-scroll>
				</div>
				<div ciq-sb-panel-active>
					<cq-scroll cq-max-height="500">
						<cq-study-legend cq-no-close="">
							<cq-section-dynamic>
								<cq-study-legend-content>
									<template cq-study-legend="">
										<cq-item>
											<cq-label></cq-label>
											<div class="ciq-icon ciq-close"></div>
										</cq-item>
									</template>
								</cq-study-legend-content>
							</cq-section-dynamic>
							<cq-placeholder>
								<div stxtap="Layout.clearStudies()" class="ciq-btn sm" keyboard-selectable="true">Clear All</div>
							</cq-placeholder>
						</cq-study-legend>
						</cq-scroll>
				</div>
				<div ciq-sb-panel-favorite>
					<cq-scroll cq-max-height="500">
						<div ciq-favorite-studies cq-no-close=""></div>
					</cq-scroll>
				</div>
				<div ciq-sb-panel-scriptiq>
					<cq-scroll cq-max-height="500">
						<cq-item><cq-clickable cq-selector="cq-scriptiq-editor" cq-method="open">New Script</cq-clickable></cq-item>
						<cq-scriptiq-menu></cq-scriptiq-menu>
					</cq-scroll>
				</div>
				<div class="ciq-info-panel">
					<cq-scroll cq-max-height="500">
						<div class="ciq-info-panel-back-btn"></div>
						<div class="ciq-info-panel-title"></div>
						<div class="fav-marker" title="Click to add to favorites"></div>
						<div class="ciq-info-panel-description"></div>
						<div class="ciq-info-panel-controls">
							<div class="ciq-btn sm">ADD STUDY</div>
							<a href="" target="studyInfo"><div class="ciq-info-btn"></div> Learn more about this study</a>
						</div>
					</cq-scroll>
				</div>
			</div>
		</div>
	`;
CIQ.UI.addComponentDefinition("cq-study-browser", StudyBrowser);

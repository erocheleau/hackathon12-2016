import Component = Coveo.Component;
import ComponentOptions = Coveo.ComponentOptions;
import IComponentBindings = Coveo.IComponentBindings;
import $$ = Coveo.$$;
import QueryEvents = Coveo.QueryEvents;
import IBuildingQueryEventArgs = Coveo.IBuildingQueryEventArgs;
import Initialization = Coveo.Initialization;
import Tab = Coveo.Tab;
import Dom = Coveo.Dom;
import IStringMap = Coveo.IStringMap;
import InitializationEvents = Coveo.InitializationEvents;
import get = Coveo.get;
import IQuery = Coveo.IQuery;
import IQueryResults = Coveo.IQueryResults;

export interface IHelloWorldOptions {}

interface ITabDefinition {
  tabElement: HTMLElement;
  tab: Tab;
  expression: string;
  resultCountSection: Dom;
}

export class HelloWorld extends Component {
  static ID = 'HelloWorld';

  static options: IHelloWorldOptions = {};

  private tabsDefinition: IStringMap<ITabDefinition> = {};

  constructor(public element: HTMLElement, public options: IHelloWorldOptions, public bindings: IComponentBindings) {
    super(element, HelloWorld.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, HelloWorld, options);

    this.bind.oneRootElement(InitializationEvents.afterComponentsInitialization, () => this.populateTabsDefinitions());
    this.bind.onRootElement(QueryEvents.duringQuery, () => this.handleDuringQuery());
  }

  private populateTabsDefinitions() {
    let allTabs = $$(this.root).findAll(`.${Component.computeCssClassNameForType(Tab.ID)}`);
    _.each(allTabs, (tabElement: HTMLElement) => {
      let tab = <Tab>get(tabElement);
      this.tabsDefinition[tab.options.id] ={
        tabElement: tabElement,
        tab: tab,
        expression: tab.options.expression,
        resultCountSection: null
      }
    });
  }
  private handleDuringQuery() {
    let lastQuery = this.queryController.getLastQuery();

    _.each(this.tabsDefinition, (tabDefinition: ITabDefinition) => {

      this.cleanResultCount(tabDefinition);

      if (this.queryStateModel.get('t') != tabDefinition.tab.options.id) {
        let queryToExecuteToCount = this.getQueryForTabCount(lastQuery, tabDefinition);

        this.queryController.getEndpoint()
          .search(queryToExecuteToCount)
          .then((response: IQueryResults) => {
            let totalCount = response.totalCount;
            let section = $$('span', {className: 'coveo-tab-results-count'}, `(${totalCount.toString(10)} results)`);
            tabDefinition.tabElement.appendChild(section.el);
            tabDefinition.resultCountSection = section;
          });
      }
    });
  }

  private getQueryForTabCount(lastQuery: IQuery, tabDefintion: ITabDefinition) : IQuery {
    let queryToExecuteForTabCount = _.clone(lastQuery);
    if (tabDefintion.expression != null && tabDefintion.expression != '') {
      if (queryToExecuteForTabCount.aq == null) {
        queryToExecuteForTabCount.aq = tabDefintion.expression;
      } else {
        queryToExecuteForTabCount.aq = `${queryToExecuteForTabCount.aq} ${tabDefintion.expression}`;
      }
    }
    queryToExecuteForTabCount.cq = null;
    return queryToExecuteForTabCount;
  }

  private cleanResultCount(tabDefintion: ITabDefinition) {
    if (tabDefintion.resultCountSection != null) {
      tabDefintion.resultCountSection.remove();
      tabDefintion.resultCountSection = null;
    }
  }
}

Initialization.registerAutoCreateComponent(HelloWorld);

import Component = Coveo.Component;
import ComponentOptions = Coveo.ComponentOptions;
import IComponentBindings = Coveo.IComponentBindings;
import $$ = Coveo.$$;
import QueryEvents = Coveo.QueryEvents;
import IBuildingQueryEventArgs = Coveo.IBuildingQueryEventArgs;
import Initialization = Coveo.Initialization;
import IQuerySuccessEventArgs = Coveo.IQuerySuccessEventArgs
import IQueryResult = Coveo.IQueryResult;
import Dom = Coveo.Dom;

export interface IHelpPanelOptions {
  // matches: IHelpPanelMatch[]
}

export interface IHelpPanelMatch {
  regex?: string,
  selector?: string
}

export class HelpPanel extends Component {
  static ID = 'HelpPanel';

  static JSUIDOCREGEX = /^https:\/\/coveo\.github\.io\/search-ui\/.*/i;

  static options: IHelpPanelOptions = {
    // matches: ComponentOptions.buildCustomOption<IHelpPanelMatch[]>((value: string) => HelpPanel.parseMatches(value))
  }

  constructor(public element: HTMLElement, public options: IHelpPanelOptions, public bindings: IComponentBindings) {
    super(element, HelpPanel.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, HelpPanel, options);

    this.bind.onRootElement(QueryEvents.deferredQuerySuccess, (args: IQuerySuccessEventArgs) => this.handleQuerySuccess(args));
  }

  private handleQuerySuccess(queryResults: IQuerySuccessEventArgs) {
    this.element.innerHTML = '';
    let results = queryResults.results.results;
    let handled = false;
    results.every((result, index) => {
      if (HelpPanel.JSUIDOCREGEX.test(result.clickUri)) { //Github.io
        let rendered = this.handleGithubIo(result).then((Dom) => {
          if (Dom) {
            this.fixLinks(Dom, result.clickUri);
            debugger;
            this.element.innerHTML = Dom.el.innerHTML;
          }
        }, (reason) => {
          console.error(reason);
        });
        handled = true;
      }
      return !handled;
    })
  }

  private handleGithubIo(result: IQueryResult): Promise<Dom> {
    return new Promise<Dom>((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', result.clickUri, true);

      xhr.onload = () => {
        if (xhr.status === 200) {
          let docContent = xhr.responseText;
          let d = $$('div'); d.el.innerHTML = docContent;
          let helpPanel = $$('div'); helpPanel.el.innerHTML = d.find('.tsd-index-panel').innerHTML;
          resolve(helpPanel);
        } else {
          reject('no');
        }
      }
      xhr.onerror = (err) => {
       reject(err.message);
      }
      xhr.send();
    });
  }

  private fixLinks(el: Dom, rootUrl: string): Dom {
    el.findAll('a').reduce((prev: HTMLElement, anchor: HTMLElement): HTMLElement=> {
      let link = anchor.getAttribute('href');
      if(link && !(/^http/i).test(link)) {
        anchor.setAttribute('href', `${rootUrl}/../${link}`);
      }
      return anchor;
    })
    return el;
  }
}
Initialization.registerAutoCreateComponent(HelpPanel);
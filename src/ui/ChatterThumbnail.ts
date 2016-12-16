import Component = Coveo.Component;
import ComponentOptions = Coveo.ComponentOptions;
import IFieldOption = Coveo.ComponentOptions;
import IComponentBindings = Coveo.IComponentBindings;
import $$ = Coveo.$$;
import QueryEvents = Coveo.QueryEvents;
import IBuildingQueryEventArgs = Coveo.IBuildingQueryEventArgs;
import Initialization = Coveo.Initialization;
import IQueryResult = Coveo.IQueryResult;

export interface IChatterThumbnailOptions {
  field: IFieldOption;
  width: string;
  height: string;
  displayAsCircle: boolean;
};

/**
 * This component is used to display the photo of the author of a chatter post.
 */
export class ChatterThumbnail extends Component {

  static ID = 'ChatterThumbnail';

  /**
   * @componentOptions
   */
  static options: IChatterThumbnailOptions = {
    /**
     * Specify the field that contains the URI where to find the photo of the chatter person.
     * 
     * The default value is `@SfCreatedBySmallPhotoURL`.
     */
    field: ComponentOptions.buildFieldOption({ defaultValue: '@SfCreatedBySmallPhotoURL' }),
    /**
     * Specify the width that the thumbnail should have.
     * 
     * The default value is `64px`.
     */
    width: ComponentOptions.buildStringOption({ defaultValue: '64px' }),
    /**
     * Specify the height the thumbnail should have.
     * 
     * The default value is `auto` to keep the aspec ratio with the width.
     */
    height: ComponentOptions.buildStringOption({ defaultValue: 'auto' }),
    /**
     * Specify if the thumbnail should be displayed as a circle.
     * 
     * The default value is true.
     */
    displayAsCircle: ComponentOptions.buildBooleanOption({ defaultValue: true })
  };

  static fields = [
    'SfCreatedBySmallPhotoURL'
  ];

  constructor(public element: HTMLElement, public options: IChatterThumbnailOptions, public bindings: IComponentBindings, public result?: IQueryResult) {
    super(element, ChatterThumbnail.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, ChatterThumbnail, options);

    let thumbnailElement = $$('img', { className: 'coveo-chatter-thumbnail' });
    thumbnailElement.el.style.width = this.options.width;
    thumbnailElement.el.style.height = this.options.height;
    if (this.options.displayAsCircle) {
      thumbnailElement.el.style.borderRadius = '50%';
    }
  }
}

Initialization.registerAutoCreateComponent(ChatterThumbnail);
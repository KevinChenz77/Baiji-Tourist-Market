import type { Schema, Struct } from '@strapi/strapi';

export interface ShopProduct extends Struct.ComponentSchema {
  collectionName: 'components_shop_products';
  info: {
    displayName: '\u5546\u54C1';
    icon: 'shopping-cart';
  };
  attributes: {
    desc: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    price: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 10;
      }>;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'shop.product': ShopProduct;
    }
  }
}

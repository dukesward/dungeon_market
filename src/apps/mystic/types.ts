import AppModel from "@/src/components/AppModel";

class MysticProduct implements AppModel {
  product_id: string
  product_name: string
  constructor(data: any) {
    this.product_id = data.product_id;
    this.product_name = data.product_name;
  }
}

export {
  MysticProduct
}
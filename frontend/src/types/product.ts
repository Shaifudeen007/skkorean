export interface MainCategory {
  id: string;
  name: string;
  categories?: Category[];
}

export interface Category {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
  mainCategoryId?: string;
  mainCategory?: MainCategory | { id: string; name: string };
}

export interface Product {
  id?: string | number;
  _id?: string | number;
  name: string;
  category?: Category | string;
  image?: string;
  mrp?: string | number;
  discountPrice?: string | number;
  price?: string | number;
  originalPrice?: string | number;
  description: string;
  keyFeatures?: string;
  whyChooseUs?: string;
  procedure?: string;
  longDescription?: {
    keyBenefits?: string[];
    wavelengths?: Array<{ name: string; desc: string }>;
    handpiece?: string;
    specifications?: Array<{ label: string; value: string }>;
  };
}

export interface ProductFormData {
  name: string;
  mainCategoryId?: string;
  categoryId: string;
  mrp: string;
  discountPrice: string;
  description: string;
  keyFeatures: string;
  whyChooseUs: string;
  procedure: string;
}

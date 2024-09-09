export interface RandomAPI {
    responses: Response[];
  }
  
  export interface Response {
    Detection: Detection;
  }
  
  export interface Detection {
    razorpay_order_id: razorpay_order_id[];
    razorpay_payment_id:   razorpay_payment_id[];
    razorpay_signature:     razorpay_signature[];
  }
  
  export interface razorpay_order_id {
    razorpay_order_id: string;
  }
  
  export interface razorpay_payment_id {
    razorpay_payment_id: string;
  }
  
  export interface razorpay_signature {
    razorpay_signature: string;
  }
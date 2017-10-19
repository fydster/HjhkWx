using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Travel.View
{
    public class createOrderBack
    {
        public int errorCode { get; set; }
        public string msg { get; set; }
        public string success { get; set; }
        public createOrder_data data { get; set; }
    }

    public class createOrder_data
    {
        public int orderId { get; set; }
        public int isNewFlag { get; set; }
    }
}

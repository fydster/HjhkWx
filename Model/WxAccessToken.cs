using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Model
{
    public class WxAccessToken
    {
        public int id { get; set; }
        public string access_token { get; set; }
        public DateTime addOn { get; set; }
        public int enable { get; set; }
    }
}

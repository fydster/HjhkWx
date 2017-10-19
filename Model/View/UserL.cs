using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Model.View
{
    public class UserL
    {
        //{"total":2,"count":2,"data":{"openid":["","OPENID1","OPENID2"]},"next_openid":"NEXT_OPENID"}
        public int total { get; set; }
        public int count { get;set; }
        public data data { get; set; }
        public string next_openid { get; set; }
    }

    public class data
    {
        public List<string> openid { get; set; }
    }
}

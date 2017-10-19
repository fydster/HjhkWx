using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Travel
{
    public class scenicList
    {
        public static string apiUrl = "http://dop.api.dfyoo.com/Ticket/scenicList";
        public string GetScenicList(string key, int page, int pageSize)
        {
            string Rsa = "";
            List<travel_para> lt = new List<travel_para>();
            travel_para tp = new travel_para
            {
                key = "key",
                value = key,
                vType = 1
            };
            lt.Add(tp);

            tp = new travel_para
            {
                key = "page",
                value = page.ToString(),
                vType = 0
            };
            lt.Add(tp);

            tp = new travel_para
            {
                key = "pageSize",
                value = pageSize.ToString(),
                vType = 0
            };
            lt.Add(tp);

            string Json = new _Travel().GetJson(lt,null);
            Rsa = new _Travel().GetTravelResult(Json, apiUrl);
            return Rsa;
        }
    }
}

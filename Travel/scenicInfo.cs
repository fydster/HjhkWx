using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Travel
{
    public class scenicInfo
    {
        public static string apiUrl = "http://dop.api.dfyoo.com/Ticket/scenicDetail";
        public string GetScenicInfo(string scenicId)
        {
            string Rsa = "";
            List<travel_para> lt = new List<travel_para>();
            travel_para tp = new travel_para
            {
                key = "scenicId",
                value = scenicId,
                vType = 1
            };
            lt.Add(tp);

            string Json = new _Travel().GetJson(lt, null);
            Rsa = new _Travel().GetTravelResult(Json, apiUrl);
            return Rsa;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Travel
{
    public class tuiPiao
    {
        public static string apiUrl = "http://dop.api.dfyoo.com/Ticket/tuiPiao";
        public string ToTuiPiao(int orderId, int causeType, string causeContent)
        {
            string Rsa = "";
            List<travel_para> lt = new List<travel_para>();
            travel_para tp = new travel_para
            {
                key = "orderId",
                value = orderId.ToString(),
                vType = 0
            };
            lt.Add(tp);

            tp = new travel_para
            {
                key = "causeType",
                value = causeType.ToString(),
                vType = 0
            };
            lt.Add(tp);

            tp = new travel_para
            {
                key = "causeContent",
                value = causeContent,
                vType = 0
            };
            lt.Add(tp);

            string Json = new _Travel().GetJson(lt, null);
            Rsa = new _Travel().GetTravelResult(Json, apiUrl);
            return Rsa;
        }
    }
}

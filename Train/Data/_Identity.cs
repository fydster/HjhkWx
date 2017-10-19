using System;
using System.Collections.Generic;
using LitJson;
using System.Text;
using System.Threading.Tasks;

namespace Train
{
    public class _Identity
    {
        public string url = "dto/trainOrder/IdentityVerification";
        
        public string IdentityPassengers(List<identity_passengers> li)
        {
            List<train_para> lt = new List<train_para>();
            //乘客信息
            string passengersJson = JsonMapper.ToJson(li);
            lt.Add(new train_para { key = "passengers", value = "{\"passengers\":" + passengersJson + "}" });

            train_get tg = new train_get
            {
                url = url,
                para = lt
            };
            string result = new _Train().GetResult(tg,"GET");
            return result;
        }
    }
}

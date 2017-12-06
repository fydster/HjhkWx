using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ExtApp.QQ.AI
{
    public class _Facecosmetic
    {
        public string url = "https://api.ai.qq.com/fcgi-bin/ptu/ptu_facecosmetic";

        /// <summary>
        /// 人脸美妆
        /// </summary>
        /// <returns></returns>
        public string facecosmetic(string imageFile)
        {
            DateTime t = new DateTime(1970, 1, 1);  //得到1970年的时间戳
            long timestamp = (DateTime.UtcNow.Ticks - t.Ticks) / 10000000;  //注意这里有时区问题，用now就要减掉8个小时
            string image = new Tool().ImgToBase64String(imageFile);
            facecosmetic wd = new facecosmetic
            {
                app_id = Comm.app_id,
                time_stamp = timestamp,
                cosmetic = 1,
                nonce_str = DateTime.Now.ToString("yyMMddHHmmss") + new Random().Next(11111, 99999),
                image = image
            };

            string result = new Comm().GetResult(new Comm().GetParaList(wd), url);
            if (result.Length > 0)
            {
                JObject jo = (JObject)JsonConvert.DeserializeObject(result);
                if (jo["ret"].ToString() == "0")
                {
                    string img = jo["data"]["image"].ToString();
                    new Tool().Base64StringToImage(img,"");
                }
            }
            return result;
        }
    }
}

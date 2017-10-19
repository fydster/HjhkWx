using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class log
    {
        public int id { get; set; }
        /// <summary>
        /// 订单号
        /// </summary>
        public string orderNo { get; set; }
        /// <summary>
        /// 日志类型0用户日志1客服日志2系统日志
        /// </summary>
        public int lType { get; set; }
        /// <summary>
        /// 用户ID
        /// </summary>
        public int uId { get; set; }
        /// <summary>
        /// 用户名称
        /// </summary>
        public string uName { get; set; }
        /// <summary>
        /// 员工ID
        /// </summary>
        public string workNo { get; set; }
        /// <summary>
        /// 员工名称
        /// </summary>
        public string eName { get; set; }
        /// <summary>
        /// 添加时间
        /// </summary>
        public DateTime addOn { get; set; }
        /// <summary>
        /// 日志内容
        /// </summary>
        public string content { get; set; }
    }
}

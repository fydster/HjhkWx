using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class evaluate
    {
        public int id { get; set; }
        /// <summary>
        /// 订单号
        /// </summary>
        public string orderNo { get; set; }
        /// <summary>
        /// 评价字段1
        /// </summary>
        public int target1 { get; set; }
        /// <summary>
        /// 评价字段2
        /// </summary>
        public int target2 { get; set; }
        /// <summary>
        /// 评价字段3
        /// </summary>
        public int target3 { get; set; }
        /// <summary>
        /// 评价字段4
        /// </summary>
        public int target4 { get; set; }
        /// <summary>
        /// 评价时间
        /// </summary>
        public DateTime addOn { get; set; }
        /// <summary>
        /// 评价备注
        /// </summary>
        public string memo { get; set; }
        /// <summary>
        /// 用户ID
        /// </summary>
        public int uid { get; set; }
        public string item { get; set; }
        public int isCp { get; set; }
    }
}

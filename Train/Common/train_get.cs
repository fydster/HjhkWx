using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Train
{
    /// <summary>
    /// get参数结构
    /// </summary>
    public class train_get
    {
        public string url { get; set; }
        public object result { get; set; }
        public List<train_para> para { get; set; }
    }
}

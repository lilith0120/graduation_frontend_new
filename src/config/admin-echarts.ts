const AdminEchartOption = {
    aria: {
        enabled: true,
        decal: {
            show: true
        }
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        bottom: 'center',
        right: '250',
        height: 400,
        orient: 'vertical',
    },
    series: [
        {
            name: '进度统计',
            type: 'pie',
            radius: ['50%', '90%'],
            right: '400',
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '40',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [{}],
        }
    ],
};

export default AdminEchartOption;
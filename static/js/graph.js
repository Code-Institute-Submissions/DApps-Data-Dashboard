queue()
    // Load data
    .defer(d3.csv, "data/dappsData.csv")
    .await(makeGraphs);

function makeGraphs(error, dappsData) {

    // Create crossfilter for data
    var ndx = crossfilter(dappsData);

    // Type conversion strings to ints
    dappsData.forEach(function(d) {
        d.users_24hr = +d.users_24hr;
        d.weekly_txs = +d.weekly_txs;
        d.txs_24hr = +d.txs_24hr;
    });
    // Calling Selector Functions
    show_platform_selector(ndx);

    // Calling chart functions
    show_user_per_platform_average(ndx);

    dc.renderAll();

}

function show_platform_selector(ndx) {

    var platformDim = ndx.dimension(dc.pluck("platform"));

    var platformSelectGroup = platformDim.group();

    dc.selectMenu("#platform-selector")
        .dimension(platformDim)
        .group(platformSelectGroup);
}

function show_user_per_platform_average(ndx) {

    var dappDim = ndx.dimension(dc.pluck("platform"));

    var averageUsersPerPlatformGroup = dappDim.group().reduce(

        function(p, v) {
            p.count++;
            p.total += v.users_24hr;
            return p;
        },

        function(p, v) {
            p.count--;
            if (p.count == 0) {
                p.total = 0;
            } else {
                p.total -= v.users_24hr;
            }
            return p;
        },

        function() {
            return { count: 0, total: 0 };
        }
    );

    var pieChart = dc.pieChart("#users-balance");

    pieChart
        .width(200)
        .height(200)
        .innerRadius(30)
        .externalRadiusPadding(25)
        .useViewBoxResizing(true)
        .dimension(dappDim)
        .group(averageUsersPerPlatformGroup)
        .valueAccessor(function(d) {
            if (d.value.count == 0) {
                return 0;
            } else {
                return Math.round(d.value.total / d.value.count);
            }
        })
        .transitionDuration(900)
        .legend(dc.legend().x(0).y(200).horizontal(true).itemHeight(13).gap(5));
}
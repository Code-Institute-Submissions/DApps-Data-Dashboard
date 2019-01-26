queue()
    // Load data
    .defer(d3.csv, 'data/dappsData.csv')
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
    show_dapps_selector(ndx);
    show_category_selector(ndx);

    // Calling chart functions
    show_user_per_platform_average(ndx);
    show_categories_user_balance(ndx);
    show_weekly_transactions_per_platform(ndx);
    show_daily_users_per_dapp(ndx);
    show_users_24hr_transactions(ndx);
    show_dapps_daily_weekly_transactions(ndx);

    dc.renderAll();

}

    // Dashboard Colors
var dashboardColors = (['#003300', '#0000b3', '#01446a', '#330000', '#218AAB']);

    // Selectors
function show_platform_selector(ndx) {

    var platformDim = ndx.dimension(dc.pluck('platform'));

    var platformSelectGroup = platformDim.group();

    dc.selectMenu('#platform-selector')
        .dimension(platformDim)
        .group(platformSelectGroup)
        .promptText('Platform Select');
}

function show_dapps_selector(ndx) {

    var dappSelectDim = ndx.dimension(dc.pluck('name'));

    var dappSelectGroup = dappSelectDim.group();

    dc.selectMenu('#dapps-selector')
        .dimension(dappSelectDim)
        .group(dappSelectGroup)
        .promptText('DApp Select');
}

function show_category_selector(ndx) {

    var categorySelectDim = ndx.dimension(dc.pluck('category'));

    var categorySelectGroup = categorySelectDim.group();

    dc.selectMenu('#category-selector')
        .dimension(categorySelectDim)
        .group(categorySelectGroup)
        .promptText('Category Select');
}

    // First piechart with custom reduce to get the average amount of users per platform
function show_user_per_platform_average(ndx) {

    var dappDim = ndx.dimension(dc.pluck('platform'));

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

    var pieChart = dc.pieChart('#users-balance');

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
                // Rounding to a whole number
                return Math.round(d.value.total / d.value.count);
            }
        })
        .transitionDuration(900)
        .ordinalColors(dashboardColors)
        .legend(dc.legend().x(0).y(185).horizontal(true).itemHeight(13).gap(5));
}

    // BarChart showing amount of users per category
function show_categories_user_balance(ndx) {

    var categoryDim = ndx.dimension(dc.pluck('category'));

    var categoryGroup = categoryDim.group().reduceSum(dc.pluck('users_24hr'));

    var barChart = dc.barChart('#category-balance');

    barChart
        .width(600)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 70 })
        .dimension(categoryDim)
        .group(categoryGroup)
        .useViewBoxResizing(true)
        .transitionDuration(900)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .colorAccessor(function(d) {
            return d.value;
        })
        .ordinalColors(dashboardColors)
        .yAxis()
        .ticks(10);
}

    // Second PieChart showing the amount of transactions per platform over a 7 day period
function show_weekly_transactions_per_platform(ndx) {

    var weeklyTxDim = ndx.dimension(dc.pluck('platform'));

    var weeklyTxGroup = weeklyTxDim.group().reduceSum(dc.pluck('weekly_txs'));

    var pieChart1 = dc.pieChart('#weekly-transactions');

    pieChart1
        .width(200)
        .height(200)
        .dimension(weeklyTxDim)
        .group(weeklyTxGroup)
        .externalRadiusPadding(25)
        .useViewBoxResizing(true)
        .transitionDuration(900)
        .ordinalColors(dashboardColors)
        .legend(dc.legend().x(0).y(185).horizontal(true).itemHeight(13).gap(5));
}

    // RowChart showing the amount of users per DApp over 24hr period
function show_daily_users_per_dapp(ndx) {

    var dailyDim = ndx.dimension(dc.pluck('name'));

    var dailyGroup = dailyDim.group().reduceSum(dc.pluck('users_24hr'));

    var rowChart = dc.rowChart('#daily-users');

    rowChart
        .width(1000)
        .height(350)
        .useViewBoxResizing(true)
        .x(d3.scale.linear().domain([6, 10]))
        .dimension(dailyDim)
        .group(dailyGroup)
        .elasticX(true)
        .rowsCap(15)
        .othersGrouper(false)
        .ordinalColors(dashboardColors)
        .transitionDuration(900);
}

    // ScatterPlot showing the amount of users and transactions over 24hr period
function show_users_24hr_transactions(ndx) {

    var usersDim = ndx.dimension(dc.pluck('users_24hr'));

    //  Returning all data required for chart and chart title function
    var transactionsDim = ndx.dimension(function(d) {
        return [d.users_24hr, d.txs_24hr, d.name, d.platform];
    });

    var userTransactionsGroup = transactionsDim.group();

    // setting min and max users for linear scale
    var minUsers = usersDim.bottom(1)[0].users_24hr;
    var maxUsers = usersDim.top(1)[0].users_24hr;

    var scatterPlotChart = dc.scatterPlot('#daily-transactions');

    scatterPlotChart
        .width(1000)
        .height(350)
        .useViewBoxResizing(true)
        .x(d3.scale.linear().domain([minUsers, maxUsers]))
        .brushOn(false)
        .symbolSize(10)
        .clipPadding(12)
        .yAxisLabel('Transactions')
        .xAxisLabel('Users')
        .title(function(d) {
            return 'Over 24hrs ' + d.key[2] + ' had ' + d.key[0] + ' users and ' + d.key[1] + ' transactions.';
        })
        .colorAccessor(function(d) {
            return d.key[3];
        })
        .ordinalColors(dashboardColors)
        .dimension(transactionsDim)
        .group(userTransactionsGroup)
        .renderHorizontalGridLines(true)
        .margins({ top: 10, right: 50, bottom: 75, left: 75 })
        .transitionDuration(900);
}

    // Stacked Chart showing daily and weekly transactions by platform
function show_dapps_daily_weekly_transactions(ndx) {

    var dappNameDim = ndx.dimension(dc.pluck('name'));

    var dappDailyTransactionDim = dappNameDim.group().reduceSum(function(d){
        return d.txs_24hr;
    });

    var dappWeeklyTransactionDim = dappNameDim.group().reduceSum(function(d){
        return d.weekly_txs;
    });

    var stackedChart = dc.barChart('#dapps-transactions');

    stackedChart
        .width(1000)
        .height(350)
        .margins({ top: 10, right: 50, bottom: 130, left: 60 })
        .useViewBoxResizing(true)
        .dimension(dappNameDim)
        .group(dappDailyTransactionDim)
        .stack(dappWeeklyTransactionDim)
        .transitionDuration(900)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .ordinalColors(dashboardColors)
        .yAxis()
        .ticks(10);

        stackedChart.on('renderlet', function (stackedChart) {
            // Rotate xAxis Labels
            stackedChart
                .selectAll('g.x text')
                .attr('dx', '-12')
                .attr('dy', '-5')
                .attr('transform', 'rotate(-90)')
                .style('text-anchor', 'end');
        });
}
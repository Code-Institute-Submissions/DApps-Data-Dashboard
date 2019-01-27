// Global Variable for tests
var ndx = crossfilter();

describe('Chart Tests', function() {
  // Build pieChart1
  function buildPieChart(id) {
    var pieChart1 = dc.pieChart('#' + id);
    pieChart1
      .dimension(dappDim)
      .group(averageUsersPerPlatform)
      .width(200)
      .height(200)
      .innerRadius(30)
      .transitionDuration(900);
    pieChart1.render();
    return pieChart1;
  }

  var dappDim = ndx.dimension(dc.pluck('platform'));
  var averageUsersPerPlatform = dappDim.group().reduce(
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

  describe('pieChart1', function() {
    var pieChart1;

    beforeEach(function() {
      pieChart1 = buildPieChart('users-balance');
      pieChart1.dimension();
      pieChart1.render();
    });

    it('should exist', function() {
      expect(show_user_per_platform_average(ndx)).not.toBeNull();
    });

    it('should have chart', function() {
      expect(dc.hasChart(pieChart1)).toBeTruthy();
    });

    it('should have a width', function() {
      expect(pieChart1.width()).toEqual(200);
    });

    it('should have a height', function() {
      expect(pieChart1.height()).toEqual(200);
    });

    it('should have an innerRadius', function() {
      expect(pieChart1.innerRadius()).toEqual(30);
    });

    it('should be responsive', function() {
      expect(pieChart1.useViewBoxResizing(true)).toBeTruthy();
    });

    it('should have a transition Duration', function() {
      expect(pieChart1.transitionDuration()).toEqual(900);
    });

    it('should have a dimension', function() {
      expect(pieChart1.dimension()).toBe(dappDim);
    });

    it('should have a group', function() {
      expect(pieChart1.group()).toBe(averageUsersPerPlatform);
    });
  });

  // build barchart
  function buildBarChart(id) {
    var barChart = dc.barChart('#' + id);
    barChart
      .dimension(categoryDim)
      .group(categoryGroup)
      .width(600)
      .height(300)
      .x(d3.scale.ordinal());
    barChart.render();
    return barChart;
  }

  var categoryDim = ndx.dimension(dc.pluck('category'));
  var categoryGroup = categoryDim.group().reduceSum(dc.pluck('users_24hr'));

  describe('barChart', function() {
    var barChart;

    beforeEach(function() {
      barChart = buildBarChart('category-balance');
      barChart.dimension();
      barChart.render();
    });

    it('should exist', function() {
      expect(show_categories_user_balance(ndx)).not.toBeNull();
    });

    it('should have chart', function() {
      expect(dc.hasChart(barChart)).toBeTruthy();
    });

    it('should have a width', function() {
      expect(barChart.width()).toEqual(600);
    });

    it('should have a height', function() {
      expect(barChart.height()).toEqual(300);
    });

    it('should have an ordinal scale', function() {
      expect(barChart.x(d3.scale.ordinal())).toBeTruthy();
    });

    it('should be responsive', function() {
      expect(barChart.useViewBoxResizing(true)).toBeTruthy();
    });

    it('should have a dimension', function() {
      expect(barChart.dimension()).toBe(categoryDim);
    });

    it('should have a group', function() {
      expect(barChart.group()).toBe(categoryGroup);
    });
  });

  // Build pieChart2
  function buildPieChart2(id) {
    var pieChart2 = dc.pieChart('#' + id);
    pieChart2
      .dimension(weeklyTxDim)
      .group(weeklyTxGroup)
      .width(200)
      .height(200)
      .externalRadiusPadding(25)
      .transitionDuration(900);
    pieChart2.render();
    return pieChart2;
  }

  var weeklyTxDim = ndx.dimension(dc.pluck('platform'));
  var weeklyTxGroup = weeklyTxDim.group().reduceSum(dc.pluck('weekly_txs'));

  describe('pieChart2', function() {
    var pieChart2;
    beforeEach(function() {
      pieChart2 = buildPieChart2('weekly-transactions');
      pieChart2.dimension();
      pieChart2.render();
    });

    it('should exist', function() {
      expect(show_weekly_transactions_per_platform(ndx)).not.toBeNull();
    });

    it('should have chart', function() {
      expect(dc.hasChart(pieChart2)).toBeTruthy();
    });

    it('should have a width', function() {
      expect(pieChart2.width()).toEqual(200);
    });

    it('should have a height', function() {
      expect(pieChart2.height()).toEqual(200);
    });

    it('should have externalRadiusPadding', function() {
      expect(pieChart2.externalRadiusPadding()).toEqual(25);
    });

    it('should be responsive', function() {
      expect(pieChart2.useViewBoxResizing(true)).toBeTruthy();
    });

    it('should have a transition Duration', function() {
      expect(pieChart2.transitionDuration()).toEqual(900);
    });

    it('should have a dimension', function() {
      expect(pieChart2.dimension()).toBe(weeklyTxDim);
    });

    it('should have a group', function() {
      expect(pieChart2.group()).toBe(weeklyTxGroup);
    });
  });

  // Build rowChart
  function buildRowChart(id) {
    var rowChart = dc.rowChart('#' + id);
    rowChart
      .dimension(dailyDim)
      .group(dailyGroup)
      .width(1000)
      .height(350)
      .x(d3.scale.linear().domain([6, 10]))
      .transitionDuration(900);
    rowChart.render();
    return rowChart;
  }

  var dailyDim = ndx.dimension(dc.pluck('name'));
  var dailyGroup = dailyDim.group().reduceSum(dc.pluck('users_24hr'));

  describe('rowChart', function() {
    var rowChart;
    beforeEach(function() {
      rowChart = buildRowChart('daily-users');
      rowChart.dimension();
      rowChart.render();
    });

    it('should exist', function() {
      expect(show_daily_users_per_dapp(ndx)).not.toBeNull();
    });

    it('should have chart', function() {
      expect(dc.hasChart(rowChart)).toBeTruthy();
    });

    it('should have a width', function() {
      expect(rowChart.width()).toEqual(1000);
    });

    it('should have a height', function() {
      expect(rowChart.height()).toEqual(350);
    });

    it('should have an linear scale', function() {
      expect(rowChart.x(d3.scale.linear().domain([6, 10]))).toBeTruthy();
    });

    it('should be responsive', function() {
      expect(rowChart.useViewBoxResizing(true)).toBeTruthy();
    });

    it('should have a dimension', function() {
      expect(rowChart.dimension()).toBe(dailyDim);
    });

    it('should have a group', function() {
      expect(rowChart.group()).toBe(dailyGroup);
    });
  });
});

describe('Selectors Tests', function() {
  it('Platform selector should exist', function() {
    expect(show_platform_selector(ndx)).not.toBeNull();
  });

  it('Dapps selector should exist', function() {
    expect(show_dapps_selector(ndx)).not.toBeNull();
  });

  it('Dapps selector should exist', function() {
    expect(show_category_selector(ndx)).not.toBeNull();
  });
});

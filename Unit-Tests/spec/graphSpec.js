describe('Chart Tests', function () {
    var ndx = crossfilter();
    describe('pieChart1', function () {
        it('should exist', function () {
            expect(show_user_per_platform_average(ndx)).not.toBeNull();
        })
    })
});
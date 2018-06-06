const testVariable = 'test';

module.exports = (interest) => {
    if (interest > 10) {
        return 'Found one!';
    } else {
        return 'No match!';
    }
}
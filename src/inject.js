//Если с английского на русский, то передаём вторым параметром true.
/**
 * Функция преобразует строку в транслит
 * @type {str}
 */
transliterate = (
	function() {
		var
			rus = "щ   ш  ч  ц  ю  я  ё  ж  ъ  ы  э  а б в г д е з и й к л м н о п р с т у ф х ь".split(/ +/g),
			eng = "shh sh ch cz yu ya yo zh `` y' e` a b v g d e z i j k l m n o p r s t u f x `".split(/ +/g)
		;
		return function(text, engToRus) {
			var x;
			for(x = 0; x < rus.length; x++) {
				text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);
				text = text.split(engToRus ? eng[x].toUpperCase() : rus[x].toUpperCase()).join(engToRus ? rus[x].toUpperCase() : eng[x].toUpperCase());
			}
			return text;
		}
	}
)();

/**
 * Преобразует вариант ответа в текст, приближенный к измеримому расстоянием Дамерау-Левенштейна
 * @param  {string} str Входная строка (только текст вопроса)
 * @return {string}     Строка, приведенная к измерению с помощью алгоритма Дамерау-Левенштейна
 */
function antitranslit(str)
{
  // TODO:
  // 1. Приводим строку к нижнему регистру
  // 2. Проводим антитранслит (B->В)
  // 3. Транслитерируем
  // 4. Оставляем только буквы и цифры
  // 5. Возвращаем полученную строку

  //1
  str = String(str).toLowerCase();

  //2
  map = {
    a:"а",
    b:"в",
    c:"с",
    d:"д",
    e:"е",
    h:"н",
    k:"к",
    o:"о",
    p:"р",
    t:"т",
    u:"и",
    x:"х",
    y:"у"
  }

  var i = str.length;
  while (i--) {
    if (str.charAt(i) in map) {
      str = str.replace(str[i], map[str.charAt(i)]) ;
    }
  }


  //3
  str = transliterate(str);

  //4
  str = str.replace(/[^a-z0-9]/gi,'');

  //5
  return str;
}

/**
 * Функция для измерения расстояния Дамерау-Левенштейна (числовой эквивалент различия строк)
 * @param  {string} seq1 Строка вопроса
 * @param  {string} seq2 Строка ответа
 * @return {integer}      Эквивалент различия строк (расстояние)
 */
var levenshteinWeighted= function(seq1,seq2)
{
    var len1=seq1.length;
    var len2=seq2.length;
    var i, j;
    var dist;
    var ic, dc, rc;
    var last, old, column;

    var weighter={
        insert:function(c) { return 1.; },
        delete:function(c) { return 0.5; },
        replace:function(c, d) { return 0.3; }
    };

    /* don't swap the sequences, or this is gonna be painful */
    if (len1 == 0 || len2 == 0) {
        dist = 0;
        while (len1)
            dist += weighter.delete(seq1[--len1]);
        while (len2)
            dist += weighter.insert(seq2[--len2]);
        return dist;
    }

    column = []; // malloc((len2 + 1) * sizeof(double));
    //if (!column) return -1;

    column[0] = 0;
    for (j = 1; j <= len2; ++j)
        column[j] = column[j - 1] + weighter.insert(seq2[j - 1]);

    for (i = 1; i <= len1; ++i) {
        last = column[0]; /* m[i-1][0] */
        column[0] += weighter.delete(seq1[i - 1]); /* m[i][0] */
        for (j = 1; j <= len2; ++j) {
            old = column[j];
            if (seq1[i - 1] == seq2[j - 1]) {
                column[j] = last; /* m[i-1][j-1] */
            } else {
                ic = column[j - 1] + weighter.insert(seq2[j - 1]);      /* m[i][j-1] */
                dc = column[j] + weighter.delete(seq1[i - 1]);          /* m[i-1][j] */
                rc = last + weighter.replace(seq1[i - 1], seq2[j - 1]); /* m[i-1][j-1] */
                column[j] = ic < dc ? ic : (dc < rc ? dc : rc);
            }
            last = old;
        }
    }

    dist = column[len2];
    return dist;
}

/**
 * Получаем правильный ответ в виде id ответа в массиве
 * @param  {array} qlist  Массиво вопросов в виде ["Только А", "Только В", "Б и Д", "Только Б", "Только Г"]
 * @param  {string} answer Правильный ответ строкой в виде "Только Б"
 * @return {integer}       id правильного ответа в qlist
 */
function getTrueAnswer(qlist,answer){
  var trueanswer = -1;
  var alist = 9000;
  for(var i=0; i<qlist.length;i++){
    alist = levenshteinWeighted(antitranslit(qlist[i]),antitranslit(answer))<levenshteinWeighted(antitranslit(qlist[alist]),antitranslit(answer))?i:alist
  }
  return alist;

}

//test
console.log(getTrueAnswer(["Только А", "Только В", "Б и Д", "Только Б", "Только Г"], "Только Б"));

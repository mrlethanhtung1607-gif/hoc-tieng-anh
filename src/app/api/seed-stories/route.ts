import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const STORIES = [
    {
        title: "Bố - Dad",
        description: "Câu chuyện cảm động về tình cha con",
        difficulty: "A1", hearts_reward: 2, cover_emoji: "👨",
        content: `Bố. [Đây không chỉ là]{This is not just} một [từ ngữ]{a word}. [Ý nghĩa của từ bố]{The meaning of dad} là [tình yêu vô điều kiện]{unconditional love}.

[Mỗi sáng]{Every morning}, [bố thức dậy]{dad wakes up} [rất sớm]{very early}. [Bố đi làm]{Dad goes to work} [để kiếm tiền]{to earn money} [nuôi gia đình]{for the family}.

[Bố luôn nói]{Dad always says}: "Con hãy [cố gắng học giỏi]{study hard}, vì [tương lai]{the future} [của con]{of yours}."

[Cảm ơn bố]{Thank you dad}. [Con yêu bố]{I love you dad} [rất nhiều]{so much}!`,
    },
    {
        title: "Một ngày ở trường",
        description: "Theo chân Minh trong một ngày đi học",
        difficulty: "A1", hearts_reward: 1, cover_emoji: "🏫",
        content: `[Sáng nay]{This morning}, Minh [thức dậy]{woke up} [lúc 6 giờ]{at 6 o'clock}. Minh [đánh răng]{brushed his teeth} và [ăn sáng]{had breakfast}.

Minh [đi bộ tới trường]{walked to school}. [Bạn thân nhất]{Best friend} của Minh là Lan. [Họ cùng nhau]{They together} [vào lớp]{went to class}.

[Thầy giáo nói]{The teacher said}: "[Hôm nay chúng ta sẽ học]{Today we will learn} [về khoa học]{about science}."

[Sau giờ học]{After class}, Minh [chơi bóng đá]{played football} [với bạn bè]{with friends}. [Đó là]{It was} [một ngày vui vẻ]{a happy day}!`,
    },
    {
        title: "Chuyến du lịch biển",
        description: "Gia đình An đi nghỉ mát",
        difficulty: "A2", hearts_reward: 2, cover_emoji: "🏖️",
        content: `[Mùa hè năm ngoái]{Last summer}, [gia đình An]{An's family} [đi du lịch]{went on a trip} [đến biển]{to the beach}.

[Họ lái xe]{They drove} [suốt ba tiếng]{for three hours}. [Khi tới nơi]{When they arrived}, An [rất vui]{was very happy}. [Biển thật đẹp]{The sea was beautiful}!

An [xây lâu đài cát]{built a sandcastle} và [bơi trong biển]{swam in the sea}. [Mẹ An nói]{An's mom said}: "[Cẩn thận nhé]{Be careful}!"

[Buổi tối]{In the evening}, [cả gia đình]{the whole family} [ăn hải sản]{ate seafood} [tại nhà hàng]{at a restaurant}.`,
    },
    {
        title: "Con mèo nhỏ",
        description: "Câu chuyện về chú mèo lạc",
        difficulty: "A1", hearts_reward: 1, cover_emoji: "🐱",
        content: `[Một hôm]{One day}, Lan [nhìn thấy]{saw} [một con mèo nhỏ]{a small cat} [ở ngoài đường]{on the street}. [Con mèo]{The cat} [rất đói]{was very hungry}.

Lan [mang nó về nhà]{brought it home} và [cho nó ăn]{fed it}. [Mẹ Lan hỏi]{Lan's mom asked}: "[Con muốn nuôi nó không]{Do you want to keep it}?"

Lan [gật đầu]{nodded} và [đặt tên cho nó]{named it} là Mimi. [Từ đó]{Since then}, Mimi [là bạn thân nhất]{is the best friend} [của Lan]{of Lan}.`,
    },
    {
        title: "Bữa tiệc sinh nhật",
        description: "Sinh nhật lần thứ 10 của Hoa",
        difficulty: "A1", hearts_reward: 1, cover_emoji: "🎂",
        content: `[Hôm nay]{Today} là [sinh nhật]{birthday} [của Hoa]{of Hoa}. Hoa [tròn 10 tuổi]{turned 10 years old}.

[Mẹ làm bánh]{Mom made a cake} [rất ngon]{very delicious}. [Bạn bè đến]{Friends came} [chúc mừng]{to congratulate} Hoa.

[Hoa rất vui]{Hoa was very happy}. [Cô ấy nhận được]{She received} [nhiều quà]{many gifts}. [Hoa nói]{Hoa said}: "[Cảm ơn mọi người]{Thank you everyone}!"

[Đây là]{This is} [sinh nhật vui nhất]{the happiest birthday} [của Hoa]{of Hoa}.`,
    },
    {
        title: "Đi chợ với mẹ",
        description: "Học từ vựng qua chuyến đi chợ",
        difficulty: "A1", hearts_reward: 1, cover_emoji: "🛒",
        content: `[Sáng Chủ nhật]{Sunday morning}, [mẹ dẫn Minh]{mom took Minh} [đi chợ]{to the market}.

[Ở chợ có]{At the market there are} [rất nhiều thứ]{many things}: [rau xanh]{green vegetables}, [trái cây]{fruits}, [thịt]{meat} và [cá tươi]{fresh fish}.

Mẹ [mua hai ký gạo]{bought two kilos of rice} và [một ít rau]{some vegetables}. Minh [xin mẹ]{asked mom for} [một quả táo]{an apple}.

[Trên đường về]{On the way home}, Minh [giúp mẹ xách đồ]{helped mom carry things}. [Mẹ khen Minh]{Mom praised Minh} [rất ngoan]{very well-behaved}.`,
    },
    {
        title: "Buổi sáng mùa đông",
        description: "Cảm nhận thời tiết mùa đông",
        difficulty: "A1", hearts_reward: 1, cover_emoji: "❄️",
        content: `[Trời rất lạnh]{It was very cold} [sáng nay]{this morning}. [Nhiệt độ]{The temperature} chỉ [mười độ]{ten degrees}.

Minh [mặc áo ấm]{wore a warm coat} và [đội mũ len]{wore a wool hat}. [Bầu trời]{The sky} [xám xịt]{was gray}.

[Mẹ pha]{Mom made} [một cốc sữa nóng]{a cup of hot milk} [cho Minh]{for Minh}. Minh [uống xong]{drank it} và [cảm thấy ấm hơn]{felt warmer}.

[Mùa đông]{Winter} [tuy lạnh]{is cold} [nhưng rất đẹp]{but very beautiful}.`,
    },
    {
        title: "Lớp vẽ đầu tiên",
        description: "Nam học vẽ tranh",
        difficulty: "A1", hearts_reward: 1, cover_emoji: "🎨",
        content: `[Hôm nay]{Today} Nam [đi học vẽ]{went to drawing class} [lần đầu tiên]{for the first time}.

[Cô giáo]{The teacher} [rất hiền]{was very kind}. [Cô dạy]{She taught} [cách vẽ]{how to draw} [một bông hoa]{a flower}.

Nam [cầm bút]{held the pen} và [vẽ rất chăm chỉ]{drew very diligently}. [Tranh của Nam]{Nam's painting} [không đẹp lắm]{was not very pretty} [nhưng Nam rất vui]{but Nam was very happy}.

[Cô giáo nói]{The teacher said}: "[Em vẽ tốt lắm]{You drew very well}! [Cố gắng lên nhé]{Keep it up}!"`,
    },
    {
        title: "Công viên buổi chiều",
        description: "Buổi chiều vui vẻ ở công viên",
        difficulty: "A1", hearts_reward: 1, cover_emoji: "🌳",
        content: `[Chiều nay]{This afternoon}, [bố đưa An]{dad took An} [đi công viên]{to the park}.

[Công viên]{The park} [rất rộng]{was very spacious} và [có nhiều cây xanh]{had many trees}. [Trẻ em]{Children} [chạy nhảy]{ran and jumped} [vui vẻ]{happily}.

An [chơi xích đu]{played on the swing} và [trượt cầu tuột]{went down the slide}. [Bố ngồi]{Dad sat} [trên ghế đá]{on the stone bench} [đọc báo]{reading a newspaper}.

[Khi mặt trời lặn]{When the sun set}, [họ đi bộ về nhà]{they walked home}. An [nắm tay bố]{held dad's hand} và [cười rất tươi]{smiled brightly}.`,
    },
    {
        title: "Bạn mới ở lớp",
        description: "Câu chuyện về tình bạn học đường",
        difficulty: "A1", hearts_reward: 1, cover_emoji: "🤝",
        content: `[Hôm nay]{Today} lớp An [có một bạn mới]{had a new student}. [Bạn ấy tên]{His name is} Hùng.

Hùng [rất nhút nhát]{was very shy}. [Không ai]{Nobody} [nói chuyện]{talked} [với Hùng]{with Hung}.

An [đến bên Hùng]{came to Hung} và [nói]{said}: "[Chào bạn]{Hello friend}! [Mình tên An]{My name is An}. [Mình chơi cùng nhé]{Let's play together}!"

[Hùng mỉm cười]{Hung smiled} và [gật đầu]{nodded}. [Từ đó]{Since then}, [họ trở thành]{they became} [đôi bạn thân]{best friends}.`,
    },
    {
        title: "Học nấu ăn",
        description: "Lần đầu vào bếp với mẹ",
        difficulty: "A2", hearts_reward: 2, cover_emoji: "👩‍🍳",
        content: `[Cuối tuần]{On the weekend}, Lan [muốn học]{wanted to learn} [nấu ăn]{cooking} [từ mẹ]{from mom}.

Mẹ [dạy Lan]{taught Lan} [làm trứng chiên]{how to make fried eggs}. [Đầu tiên]{First}, [đập trứng]{crack the egg} [vào bát]{into a bowl}. [Sau đó]{Then}, [đổ ra chảo]{pour it into the pan}.

Lan [hơi sợ]{was a little scared} [vì dầu nóng]{because the oil was hot}. [Nhưng mẹ giúp]{But mom helped} và [cùng làm]{did it together}.

[Đĩa trứng]{The plate of eggs} [hơi cháy]{was a bit burnt} [nhưng Lan]{but Lan} [rất tự hào]{was very proud}. [Bố khen ngon]{Dad said it was delicious}!`,
    },
    {
        title: "Thư viện trường",
        description: "Khám phá thế giới sách",
        difficulty: "A1", hearts_reward: 1, cover_emoji: "📚",
        content: `[Mỗi thứ Tư]{Every Wednesday}, An [đến thư viện]{goes to the library} [để đọc sách]{to read books}.

[Thư viện]{The library} [rất yên tĩnh]{is very quiet}. [Có rất nhiều sách]{There are many books} [trên kệ]{on the shelves}.

[An thích đọc]{An likes to read} [truyện cổ tích]{fairy tales}. [Cuốn yêu thích nhất]{The favorite one} [của An]{of An} là "[Cô bé Lọ Lem]{Cinderella}."

[Cô thủ thư]{The librarian} [rất tốt bụng]{is very kind}. [Cô ấy giúp An]{She helps An} [tìm sách mới]{find new books} [mỗi tuần]{every week}.`,
    },
    {
        title: "Nuôi cá vàng",
        description: "Trách nhiệm với thú cưng nhỏ",
        difficulty: "A1", hearts_reward: 1, cover_emoji: "🐟",
        content: `Minh [được bố tặng]{was given by dad} [một con cá vàng]{a goldfish} [nhân dịp sinh nhật]{on his birthday}.

[Con cá]{The fish} [rất đẹp]{was very beautiful}. [Nó bơi]{It swam} [vòng vòng]{around and around} [trong bể]{in the tank}.

[Mỗi ngày]{Every day}, Minh [cho cá ăn]{feeds the fish} [đúng giờ]{on time}. Minh [cũng thay nước]{also changes the water} [hai lần một tuần]{twice a week}.

Minh [học được]{learned} [sự kiên nhẫn]{patience} và [trách nhiệm]{responsibility} [nhờ chú cá nhỏ]{thanks to the little fish}.`,
    },
    {
        title: "Trận mưa bất chợt",
        description: "Một buổi chiều bị mắc mưa",
        difficulty: "A2", hearts_reward: 2, cover_emoji: "🌧️",
        content: `[Chiều hôm đó]{That afternoon}, An [đang đi bộ]{was walking} [về nhà]{home}. [Bầu trời]{The sky} [bỗng tối sầm]{suddenly darkened}.

[Mưa bắt đầu rơi]{Rain started to fall} [rất nhanh]{very quickly}. An [không mang ô]{didn't bring an umbrella}.

An [chạy vào]{ran into} [một quán cà phê nhỏ]{a small coffee shop} [để trú mưa]{to take shelter}. [Chủ quán]{The shop owner} [mời An]{offered An} [một cốc trà nóng]{a cup of hot tea}.

[Sau 30 phút]{After 30 minutes}, [mưa tạnh]{the rain stopped}. [Cầu vồng]{A rainbow} [xuất hiện]{appeared} [trên bầu trời]{in the sky}. [Thật đẹp]{So beautiful}!`,
    },
    {
        title: "Buổi cắm trại",
        description: "Trải nghiệm cắm trại đầu tiên",
        difficulty: "A2", hearts_reward: 2, cover_emoji: "⛺",
        content: `[Lớp Minh]{Minh's class} [đi cắm trại]{went camping} [ở ngoại ô]{in the suburbs}.

[Các bạn]{The students} [dựng lều]{set up tents} và [nhóm lửa]{made a campfire}. [Trời bắt đầu tối]{It started to get dark}.

[Thầy giáo]{The teacher} [kể chuyện ma]{told ghost stories}. [Mọi người]{Everyone} [vừa sợ]{was scared} [vừa thích]{and excited}.

[Đêm đó]{That night}, Minh [nhìn lên trời]{looked up at the sky} và [thấy rất nhiều sao]{saw many stars}. [Đó là]{It was} [đêm đẹp nhất]{the most beautiful night} [mà Minh từng thấy]{Minh had ever seen}.`,
    },
    {
        title: "Siêu thị với ông bà",
        description: "Đi siêu thị cùng ông bà ngoại",
        difficulty: "A1", hearts_reward: 1, cover_emoji: "🏪",
        content: `[Chủ nhật]{On Sunday}, [ông bà]{grandparents} [đưa Hoa]{took Hoa} [đi siêu thị]{to the supermarket}.

[Siêu thị]{The supermarket} [rất lớn]{was very big}. [Có đủ thứ]{There were all kinds of things}: [bánh kẹo]{sweets}, [đồ chơi]{toys}, [quần áo]{clothes}.

Hoa [xin ông]{asked grandpa for} [một hộp sữa]{a box of milk} và [một gói bánh]{a pack of cookies}. [Ông đồng ý]{Grandpa agreed}.

[Bà mua]{Grandma bought} [rau quả tươi]{fresh vegetables}. [Trên đường về]{On the way back}, [Hoa cảm ơn]{Hoa thanked} [ông bà]{grandparents}.`,
    },
    {
        title: "Giấc mơ phi hành gia",
        description: "Minh muốn bay lên vũ trụ",
        difficulty: "A2", hearts_reward: 2, cover_emoji: "🚀",
        content: `Minh [mơ ước]{dreams of} [trở thành]{becoming} [một phi hành gia]{an astronaut}.

[Mỗi đêm]{Every night}, Minh [nhìn lên trời]{looks up at the sky} và [đếm sao]{counts the stars}. Minh [tự hỏi]{wonders}: "[Trên mặt trăng]{On the moon} [có gì]{what is there}?"

[Ở trường]{At school}, Minh [học rất giỏi]{studies very hard} [môn khoa học]{in science}. [Cô giáo nói]{The teacher said}: "[Nếu em cố gắng]{If you try hard}, [giấc mơ]{your dream} [sẽ thành hiện thực]{will come true}."

Minh [tin rằng]{believes that} [một ngày nào đó]{one day} [mình sẽ bay]{he will fly} [lên vũ trụ]{into space}!`,
    },
    {
        title: "Buổi biểu diễn âm nhạc",
        description: "Lan chơi đàn piano trước lớp",
        difficulty: "A2", hearts_reward: 2, cover_emoji: "🎹",
        content: `[Hôm nay]{Today} [trường tổ chức]{the school organized} [buổi biểu diễn âm nhạc]{a music performance}.

Lan [tập đàn piano]{practiced piano} [suốt một tháng]{for a whole month}. [Lan rất hồi hộp]{Lan was very nervous}.

[Khi đến lượt]{When it was her turn}, Lan [bước lên sân khấu]{walked onto the stage}. [Lan hít thở sâu]{Lan took a deep breath} và [bắt đầu chơi]{started playing}.

[Bài hát]{The song} [rất hay]{was very beautiful}. [Mọi người vỗ tay]{Everyone clapped}. [Lan cúi chào]{Lan bowed} và [mỉm cười hạnh phúc]{smiled happily}.`,
    },
    {
        title: "Nông trại của ông",
        description: "Nghỉ hè ở quê với ông ngoại",
        difficulty: "A2", hearts_reward: 2, cover_emoji: "🌾",
        content: `[Hè này]{This summer}, An [về quê]{went back to the countryside} [thăm ông]{to visit grandpa}.

[Ông có]{Grandpa has} [một nông trại nhỏ]{a small farm} [với gà vịt]{with chickens and ducks} và [một mảnh vườn]{a garden}.

[Mỗi sáng]{Every morning}, An [giúp ông]{helps grandpa} [cho gà ăn]{feed the chickens} và [tưới rau]{water the vegetables}.

[An thích nhất]{An likes most} [là hái trái cây]{is picking fruits}. [Xoài]{Mangoes} [ở vườn ông]{in grandpa's garden} [ngọt vô cùng]{are incredibly sweet}.

[An muốn]{An wants to} [ở đây mãi]{stay here forever}!`,
    },
    {
        title: "Bác sĩ tương lai",
        description: "Hoa muốn trở thành bác sĩ",
        difficulty: "A2", hearts_reward: 2, cover_emoji: "👩‍⚕️",
        content: `[Bà ngoại]{Grandma} [bị ốm]{was sick}. Hoa [rất lo lắng]{was very worried}.

[Bác sĩ đến]{The doctor came} và [khám cho bà]{examined grandma}. [Bác sĩ nói]{The doctor said}: "[Bà chỉ bị cảm nhẹ]{Grandma just has a mild cold}. [Uống thuốc]{Take medicine} và [nghỉ ngơi]{rest}."

[Hai ngày sau]{After two days}, [bà khỏe lại]{grandma recovered}. Hoa [rất vui]{was very happy}.

[Từ đó]{Since then}, Hoa [muốn trở thành]{wants to become} [bác sĩ]{a doctor} [để giúp]{to help} [mọi người]{everyone} [khỏe mạnh]{stay healthy}.`,
    },
    {
        title: "Cuộc đua xe đạp",
        description: "Minh tham gia cuộc đua trong xóm",
        difficulty: "A2", hearts_reward: 2, cover_emoji: "🚲",
        content: `[Cuối tuần này]{This weekend}, [xóm Minh]{Minh's neighborhood} [tổ chức]{organized} [cuộc đua xe đạp]{a bicycle race}.

Minh [luyện tập]{practiced} [mỗi ngày]{every day}. [Bố cổ vũ]{Dad cheered}: "[Con làm được]{You can do it}!"

[Ngày đua]{On race day}, Minh [đạp rất nhanh]{pedaled very fast}. [Gần đến đích]{Near the finish line}, Minh [bị vượt qua]{was overtaken}.

Minh [về nhì]{came in second place}. [Dù không thắng]{Although didn't win}, Minh [rất tự hào]{was very proud}. [Bố ôm Minh]{Dad hugged Minh} và [nói]{said}: "[Bố rất tự hào]{Dad is very proud} [về con]{of you}."`,
    },
    {
        title: "Ngày Tết vui vẻ",
        description: "Không khí Tết Nguyên Đán",
        difficulty: "A2", hearts_reward: 2, cover_emoji: "🧧",
        content: `[Tết đến rồi]{Tet is coming}! [Nhà nhà]{Every house} [dọn dẹp]{is cleaning up} và [trang trí]{decorating}.

[Mẹ gói bánh chưng]{Mom made banh chung}. [Bố treo câu đối]{Dad hung couplets}. An [được mặc áo mới]{wore new clothes}.

[Sáng mùng Một]{On the first morning}, [cả nhà]{the whole family} [đi chúc Tết]{visited for New Year greetings}. An [nhận lì xì]{received lucky money} [từ ông bà]{from grandparents}.

An [vui lắm]{was so happy}. [Tết là dịp]{Tet is the occasion} [để gia đình]{for the family} [sum họp]{to reunite} và [yêu thương nhau]{love each other}.`,
    },
    {
        title: "Cửa hàng kem",
        description: "Buổi chiều ngọt ngào",
        difficulty: "A1", hearts_reward: 1, cover_emoji: "🍦",
        content: `[Trời rất nóng]{It was very hot}. Lan và [bạn thân]{best friend} [muốn ăn kem]{wanted to eat ice cream}.

[Hai bạn]{The two friends} [đi đến]{went to} [cửa hàng kem]{the ice cream shop}. [Có rất nhiều vị]{There were many flavors}: [sô-cô-la]{chocolate}, [dâu tây]{strawberry}, [vani]{vanilla}.

Lan [chọn vị dâu]{chose strawberry}. [Bạn ấy]{Her friend} [chọn sô-cô-la]{chose chocolate}.

[Họ ngồi]{They sat} [dưới bóng cây]{under a tree} và [ăn kem]{ate ice cream}. [Tuyệt vời]{Wonderful}!`,
    },
    {
        title: "Học bơi",
        description: "Lần đầu xuống hồ bơi",
        difficulty: "A2", hearts_reward: 2, cover_emoji: "🏊",
        content: `[Mùa hè]{In summer}, [bố đăng ký]{dad signed up} [cho Minh]{for Minh} [học bơi]{swimming lessons}.

[Lần đầu]{The first time}, Minh [rất sợ nước]{was very afraid of water}. [Thầy dạy bơi]{The swimming coach} [rất kiên nhẫn]{was very patient}.

[Sau hai tuần]{After two weeks}, Minh [đã biết bơi]{could swim}. [Minh bơi được]{Minh could swim} [25 mét]{25 meters} [không nghỉ]{without stopping}.

[Bố rất vui]{Dad was very happy} và [nói]{said}: "[Con giỏi lắm]{You are very good}! [Bơi lội]{Swimming} [rất tốt]{is very good} [cho sức khỏe]{for health}."`,
    },
    {
        title: "Vườn hoa của bà",
        description: "Bà chăm sóc vườn hoa tuyệt đẹp",
        difficulty: "A1", hearts_reward: 1, cover_emoji: "🌸",
        content: `[Bà ngoại]{Grandma} [có một vườn hoa]{has a flower garden} [rất đẹp]{very beautiful}.

[Trong vườn có]{In the garden there are} [hoa hồng]{roses}, [hoa cúc]{chrysanthemums}, và [hoa lan]{orchids}. [Mỗi sáng]{Every morning}, bà [tưới nước]{waters} [cho hoa]{the flowers}.

Hoa [giúp bà]{helps grandma} [nhổ cỏ]{pull weeds} và [bón phân]{add fertilizer}. [Bà dạy Hoa]{Grandma teaches Hoa}: "[Muốn hoa đẹp]{If you want beautiful flowers}, [phải chăm chỉ]{you must be diligent}."

[Khi hoa nở]{When the flowers bloom}, [cả vườn]{the whole garden} [thơm ngát]{smells wonderful}.`,
    },
    {
        title: "Chú chó Bông",
        description: "Một ngày của chú chó cưng",
        difficulty: "A1", hearts_reward: 1, cover_emoji: "🐕",
        content: `[Nhà Minh]{Minh's family} [nuôi một chú chó]{has a dog} [tên là Bông]{named Bong}.

Bông [rất thông minh]{is very smart} và [hiền lành]{gentle}. [Mỗi chiều]{Every afternoon}, Minh [dắt Bông]{takes Bong} [đi dạo]{for a walk}.

Bông [thích chơi]{likes to play} [bắt bóng]{catch the ball}. [Khi Minh buồn]{When Minh is sad}, Bông [đến bên]{comes close} và [liếm tay Minh]{licks Minh's hand}.

Minh [yêu Bông]{loves Bong} [rất nhiều]{very much}. Bông [là người bạn]{is a friend} [trung thành nhất]{most loyal}.`,
    },
    {
        title: "Phiên chợ quê",
        description: "Chợ phiên ở vùng nông thôn",
        difficulty: "A2", hearts_reward: 2, cover_emoji: "🧺",
        content: `[Cứ năm ngày một lần]{Every five days}, [làng An]{An's village} [có phiên chợ]{has a market day}.

[Chợ phiên]{The market} [rất đông vui]{is very lively}. [Người bán]{Sellers} [bày hàng]{display goods} [trên mặt đất]{on the ground}.

[Có người bán]{Some sell} [rau quả tươi]{fresh produce}. [Có người bán]{Some sell} [quần áo]{clothes}. [Còn có cả]{There are even} [người bán đồ chơi]{toy sellers}.

An [thích nhất]{likes most} [quầy chè]{the dessert stall}. [Một bát chè đỗ đen]{A bowl of black bean dessert} [chỉ năm nghìn]{costs only five thousand}. [Ngon và rẻ]{Delicious and cheap}!`,
    },
    {
        title: "Giải cờ vua",
        description: "Nam tham gia giải cờ vua trường",
        difficulty: "A2", hearts_reward: 2, cover_emoji: "♟️",
        content: `Nam [rất giỏi]{is very good at} [chơi cờ vua]{playing chess}. [Hôm nay]{Today}, [trường tổ chức]{the school organized} [giải cờ vua]{a chess tournament}.

[Trận đầu]{The first match}, Nam [thắng dễ dàng]{won easily}. [Trận thứ hai]{The second match} [khó hơn]{was harder}.

[Đến trận chung kết]{In the final}, [đối thủ]{the opponent} [rất mạnh]{was very strong}. Nam [suy nghĩ kỹ]{thought carefully} [mỗi nước đi]{each move}.

[Cuối cùng]{Finally}, Nam [thắng]{won}! [Nam nhận]{Nam received} [cúp vàng]{a gold trophy}. [Cả lớp]{The whole class} [hoan hô]{cheered}!`,
    },
    {
        title: "Bão lớn",
        description: "Gia đình chống chọi cơn bão",
        difficulty: "B1", hearts_reward: 3, cover_emoji: "🌪️",
        content: `[Tin tức báo]{The news reported}: "[Cơn bão lớn]{A big storm} [sắp đổ bộ]{is about to hit}."

[Bố và mẹ]{Dad and mom} [chằng chống cửa]{secured the doors}. [Cả nhà]{The whole family} [ở trong nhà]{stayed indoors}.

[Gió thổi rất mạnh]{The wind blew very strongly}. [Mưa rơi xối xả]{Rain poured heavily}. [Điện bị cắt]{The power was cut off}.

[Sáng hôm sau]{The next morning}, [bão đã qua]{the storm had passed}. [Mọi người]{Everyone} [giúp nhau]{helped each other} [dọn dẹp]{clean up}. [Tình làng xóm]{Neighborhood bond} [thật ấm áp]{is truly warm}.`,
    },
    {
        title: "Bài kiểm tra toán",
        description: "Hoa chuẩn bị cho bài kiểm tra",
        difficulty: "A1", hearts_reward: 1, cover_emoji: "📝",
        content: `[Ngày mai]{Tomorrow} [có bài kiểm tra]{there is a test} [môn toán]{in math}.

Hoa [ôn bài]{studied} [suốt buổi tối]{all evening}. [Mẹ mang]{Mom brought} [sữa và bánh]{milk and cookies} [cho Hoa]{for Hoa}.

[Hoa giải]{Hoa solved} [rất nhiều bài tập]{many exercises}. [Có bài khó]{Some were difficult}, [có bài dễ]{some were easy}.

[Sáng hôm sau]{The next morning}, Hoa [làm bài]{took the test} [rất tự tin]{very confidently}. [Kết quả]{The result}: Hoa [được 9 điểm]{got 9 points}! [Mẹ ôm Hoa]{Mom hugged Hoa} và [nói]{said}: "[Giỏi lắm con]{Well done, darling}!"`,
    },
];

export async function POST() {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
        }

        // Delete old stories
        const { error: deleteError } = await supabase
            .from("stories")
            .delete()
            .neq("id", "00000000-0000-0000-0000-000000000000");

        if (deleteError) {
            return NextResponse.json({ error: `Lỗi xóa: ${deleteError.message}` }, { status: 500 });
        }

        // Insert all stories in batches
        const batchSize = 10;
        let inserted = 0;

        for (let i = 0; i < STORIES.length; i += batchSize) {
            const batch = STORIES.slice(i, i + batchSize);
            const { error } = await supabase.from("stories").insert(batch);
            if (error) {
                return NextResponse.json({
                    error: `Lỗi insert batch ${Math.floor(i / batchSize) + 1}: ${error.message}`,
                    insertedSoFar: inserted,
                }, { status: 500 });
            }
            inserted += batch.length;
        }

        return NextResponse.json({
            success: true,
            message: `✅ Đã tạo ${inserted} truyện thành công!`,
            total: inserted,
        });
    } catch (error) {
        console.error("Seed stories error:", error);
        return NextResponse.json({ error: "Lỗi không xác định" }, { status: 500 });
    }
}

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

public class UpdateDB {
    public static void main(String[] args) {
        String url = "jdbc:mariadb://localhost:3306/cam_pucallpa?useInformationSchema=true";
        String user = "root";
        String password = ""; 
        
        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            String sql1 = "UPDATE usuarios SET password_hash = ? WHERE username_dni IN ('11111111', '22222222', '33333333', '44444444', '55555555', '66666666')";
            try (PreparedStatement pstmt = conn.prepareStatement(sql1)) {
                pstmt.setString(1, "$2a$12$f4hYzvxn4fXNlHyk0OsY6.NO6FYR8jz/0Dcxvm6dE8gFnDNgJSyo2");
                int count = pstmt.executeUpdate();
                System.out.println("Updated Clave123 users: " + count);
            }
            
            String sql2 = "UPDATE usuarios SET password_hash = ? WHERE username_dni IN ('77777777', '88888888', '99999999')";
            try (PreparedStatement pstmt = conn.prepareStatement(sql2)) {
                pstmt.setString(1, "$2a$12$Onzp7XaLnbFUEq/VCFLfZ.oESZ6z3rifH7uon2aGf1nttTbkZB5hK");
                int count = pstmt.executeUpdate();
                System.out.println("Updated ABC123ca users: " + count);
            }
        } catch(Exception e) {
            e.printStackTrace();
        }
    }
}

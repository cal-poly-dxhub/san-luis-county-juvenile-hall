// MARK: Imports

import Foundation
import Amplify

// MARK: Extensions

extension Juvenile: Codable {
    public init(from decoder: Decoder) throws {
        let values = try decoder.container(keyedBy: Juvenile.keys)

        do {
            let id_integer = try values.decode(Int.self, forKey: .id)
            id = String(id_integer)
        } catch {
            id = try values.decode(String.self, forKey: .id)
        }

        first_name = try values.decode(String.self, forKey: .first_name)
        last_name = try values.decode(String.self, forKey: .last_name)
        points = try values.decode(Int.self, forKey: .points)
        event_id = try values.decode(Int.self, forKey: .event_id)
        active = try values.decode(Int.self, forKey: .active)

        if let temp = try? values.decode(Bool.self, forKey: .isEnqueued) {
            isEnqueued = temp
        } else {
            isEnqueued = false
        }
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: Juvenile.keys)

        try container.encode(id, forKey: .id)
        try container.encode(first_name, forKey: .first_name)
        try container.encode(last_name, forKey: .last_name)
        try container.encode(points, forKey: .points)
        try container.encode(event_id, forKey: .event_id)
        try container.encode(active, forKey: .active)
        try container.encode(isEnqueued, forKey: .isEnqueued)
    }
}

extension Juvenile: Equatable {
    public static func ==(lhs: Juvenile, rhs: Juvenile) -> Bool {
        return lhs.event_id == rhs.event_id
    }
}

extension Juvenile: Identifiable { }

extension Juvenile: Hashable {
    public func hash(into hasher: inout Hasher) {
        hasher.combine(event_id)
    }
}
